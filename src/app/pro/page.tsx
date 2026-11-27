
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

interface Reservation {
  id: string;
  code_reservation: string;
  statut: string;
  station_nom: string;
  service_nom: string;
  prix_tnd: number;
  nom_client: string;
  telephone: string;
  vehicule: string;
  date_reservation: string;
  heure_reservation: string;
}

export default function EspaceProPage() {
  const [onglet, setOnglet] = useState<"planning" | "ajout">("planning");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string>("");
  const [succes, setSucces] = useState<string>("");
  const [enCours, setEnCours] = useState<boolean>(false);

  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("Tunis");
  const [quartier, setQuartier] = useState("");
  const [prixExt, setPrixExt] = useState("20");
  const [prixComp, setPrixComp] = useState("45");

  const charger = async () => {
    setChargement(true);
    setErreur("");

    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("date_reservation", { ascending: true });

      if (error) throw error;

      setReservations(data || []);
    } catch (err: any) {
      setErreur(err.message || "Erreur lors du chargement des reservations.");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const majStatut = async (id: string, nouveauStatut: string) => {
    setErreur("");

    try {
      const { error } = await supabase
        .from("reservations")
        .update({ statut: nouveauStatut })
        .eq("id", id);

      if (error) throw error;

      await charger();
    } catch (err: any) {
      setErreur(err.message || "Erreur lors de la mise a jour du statut.");
    }
  };

  const ajouterStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    setSucces("");
    setEnCours(true);

    try {
      const { data: st, error: errStation } = await supabase
        .from("stations")
        .insert({ nom, ville, quartier, note: 5.0, avis: 1 })
        .select()
        .single();

      if (errStation) throw errStation;

      if (!st) {
        throw new Error("Aucune donnee retournee par l'insertion de la station.");
      }

      const { error: errServices } = await supabase.from("services").insert([
        {
          station_id: st.id,
          nom: "Lavage Exterieur",
          prix_tnd: Number(prixExt),
          duree_min: 25,
        },
        {
          station_id: st.id,
          nom: "Lavage Complet",
          prix_tnd: Number(prixComp),
          duree_min: 45,
        },
      ]);

      if (errServices) throw errServices;

      setNom("");
      setQuartier("");
      setSucces("Station ajoutee avec succes !");
    } catch (err: any) {
      setErreur(
        err.message || "Une erreur est survenue lors de l'ajout de la station."
      );
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-2.5 py-1 text-lg font-bold"
            >
              LavGo
            </Link>

            <span className="text-xs font-semibold text-blue-300">
              Espace Pro
            </span>
          </div>

          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            {"<"} Accueil client
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex gap-3">
          <button
            type="button"
            onClick={() => setOnglet("planning")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
              onglet === "planning"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200"
            }`}
          >
            Planning ({reservations.length})
          </button>

          <button
            type="button"
            onClick={() => setOnglet("ajout")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
              onglet === "ajout"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200"
            }`}
          >
            + Inscrire ma station
          </button>
        </div>

        {onglet === "planning" ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Reservations recues</h1>

            {erreur && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {erreur}
              </p>
            )}

            {chargement ? (
              <p className="text-slate-500">Chargement...</p>
            ) : reservations.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-slate-500 border">
                Aucune reservation.
              </p>
            ) : (
              reservations.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-white p-6"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-400">
                      #{r.code_reservation}
                    </span>

                    <span className="ml-2 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {r.statut}
                    </span>

                    <h2 className="mt-1 text-lg font-bold">
                      {r.station_nom} - {r.service_nom} ({r.prix_tnd} TND)
                    </h2>

                    <p className="text-sm text-slate-600">
                      Client : {r.nom_client} - Tel : {r.telephone} - {r.vehicule}
                    </p>

                    <p className="text-sm font-medium text-blue-700">
                      Date : {r.date_reservation} a {r.heure_reservation}
                    </p>
                  </div>

                  {r.statut === "Confirmee" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => majStatut(r.id, "Terminee")}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
                      >
                        Terminee
                      </button>

                      <button
                        type="button"
                        onClick={() => majStatut(r.id, "Annulee")}
                        className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <form
            onSubmit={ajouterStation}
            className="mx-auto max-w-xl space-y-4 rounded-2xl border bg-white p-6"
          >
            <h1 className="text-xl font-bold">Inscrire ma station</h1>

            {succes && (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
                OK {succes}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium">
                Nom de la station
              </label>

              <input
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Ville</label>

                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm"
                >
                  <option value="Tunis">Tunis</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Nabeul">Nabeul</option>
                  <option value="Bizerte">Bizerte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Quartier</label>

                <input
                  required
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Prix Exterieur (TND)
                </label>

                <input
                  type="number"
                  required
                  value={prixExt}
                  onChange={(e) => setPrixExt(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Prix Complet (TND)
                </label>

                <input
                  type="number"
                  required
                  value={prixComp}
                  onChange={(e) => setPrixComp(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {erreur && (
              <p className="mt-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {erreur}
              </p>
            )}

            <button
              type="submit"
              disabled={enCours}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {enCours ? "Enregistrement..." : "Enregistrer ma station"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
