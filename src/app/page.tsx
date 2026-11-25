"use client";

import React, { useState, useEffect } from "react";
import ReservationModal, { Station, Reservation } from "../components/ReservationModal";

const STATIONS_DEMO: Station[] = [
  {
    id: "st-1",
    nom: "AquaClean Express",
    ville: "Tunis",
    quartier: "Les Berges du Lac 2",
    note: 4.8,
    avis: 124,
    services: [
      { id: "s1", nom: "Lavage Extérieur", prixTnd: 15, dureeMin: 25 },
      { id: "s2", nom: "Lavage Complet (Int. + Ext.)", prixTnd: 25, dureeMin: 45 },
      { id: "s3", nom: "Nettoyage Intégral & Sièges", prixTnd: 65, dureeMin: 120 },
    ],
  },
  {
    id: "st-2",
    nom: "AutoSpa Ennasr",
    ville: "Tunis",
    quartier: "Cité Ennasr 2, Ariana",
    note: 4.6,
    avis: 89,
    services: [
      { id: "s4", nom: "Lavage Extérieur", prixTnd: 14, dureeMin: 20 },
      { id: "s5", nom: "Lavage Complet", prixTnd: 22, dureeMin: 40 },
    ],
  },
  {
    id: "st-3",
    nom: "Prestige Wash Sousse",
    ville: "Sousse",
    quartier: "Kantaoui / Hammam Sousse",
    note: 4.9,
    avis: 156,
    services: [
      { id: "s6", nom: "Lavage Extérieur", prixTnd: 15, dureeMin: 25 },
      { id: "s7", nom: "Lavage Complet", prixTnd: 25, dureeMin: 50 },
    ],
  },
  {
    id: "st-4",
    nom: "Cap Bon Auto Lavage",
    ville: "Nabeul",
    quartier: "Avenue Habib Bourguiba, Nabeul",
    note: 4.7,
    avis: 64,
    services: [
      { id: "s8", nom: "Lavage Extérieur", prixTnd: 12, dureeMin: 25 },
      { id: "s9", nom: "Lavage Complet", prixTnd: 20, dureeMin: 45 },
    ],
  },
  {
    id: "st-5",
    nom: "Sfax Auto Shine",
    ville: "Sfax",
    quartier: "Route de Tunis Km 3",
    note: 4.5,
    avis: 72,
    services: [
      { id: "s10", nom: "Lavage Extérieur", prixTnd: 13, dureeMin: 25 },
      { id: "s11", nom: "Lavage Complet", prixTnd: 22, dureeMin: 45 },
    ],
  },
  {
    id: "st-6",
    nom: "Bizerte Wash Center",
    ville: "Bizerte",
    quartier: "Corniche Bizerte",
    note: 4.6,
    avis: 41,
    services: [
      { id: "s12", nom: "Lavage Extérieur", prixTnd: 12, dureeMin: 25 },
      { id: "s13", nom: "Lavage Complet", prixTnd: 20, dureeMin: 40 },
    ],
  },
];

export default function HomePage() {
  const [onglet, setOnglet] = useState<"recherche" | "historique">("recherche");
  const [ville, setVille] = useState("Tunis");
  const [stationChoisie, setStationChoisie] = useState<Station | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("lavgo_reservations");
    if (data) setReservations(JSON.parse(data));
  }, []);

  const ajouterReservation = (nouvelle: Reservation) => {
    const maj = [nouvelle, ...reservations];
    setReservations(maj);
    localStorage.setItem("lavgo_reservations", JSON.stringify(maj));
  };

  const annulerReservation = (id: string) => {
    const maj = reservations.map((r) =>
      r.id === id ? { ...r, statut: "Annulée" as const } : r
    );
    setReservations(maj);
    localStorage.setItem("lavgo_reservations", JSON.stringify(maj));
  };

  const stationsFiltrees = STATIONS_DEMO.filter((s) => s.ville === ville);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-lg font-bold text-white">
              LavGo
            </span>
            <span className="text-xs font-medium text-slate-500">Tunisie</span>
          </div>

          <nav className="flex items-center gap-3 text-sm font-medium">
            <button
              type="button"
              onClick={() => setOnglet("recherche")}
              className={`rounded-lg px-3 py-2 ${
                onglet === "recherche" ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-600"
              }`}
            >
              Stations
            </button>
            <button
              type="button"
              onClick={() => setOnglet("historique")}
              className={`rounded-lg px-3 py-2 ${
                onglet === "historique" ? "bg-blue-50 font-semibold text-blue-700" : "text-slate-600"
              }`}
            >
              Mes Réservations ({reservations.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {onglet === "recherche" ? (
          <>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Réservation de lavage auto en ligne
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-slate-900 sm:text-5xl">
                Votre voiture propre, sans attente en station.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Comparez les stations de lavage près de chez vous en Tunisie et réservez votre créneau en dinars (TND).
              </p>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-md sm:flex-row">
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                >
                  <option value="Tunis">Grand Tunis (Tunis, Ariana, Ben Arous, Manouba)</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Nabeul">Nabeul & Hammamet</option>
                  <option value="Bizerte">Bizerte</option>
                </select>
                <a
                  href="#stations"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Voir les stations ({stationsFiltrees.length})
                </a>
              </div>
            </div>

            <section id="stations" className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">
                Stations disponibles à {ville} ({stationsFiltrees.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {stationsFiltrees.map((station) => (
                  <div
                    key={station.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{station.nom}</h3>
                          <p className="text-sm text-slate-500">{station.quartier}</p>
                        </div>
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          ★ {station.note} ({station.avis})
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                        {station.services.map((s) => (
                          <div key={s.id} className="flex justify-between text-sm">
                            <span className="text-slate-700">
                              {s.nom} <span className="text-xs text-slate-400">({s.dureeMin} min)</span>
                            </span>
                            <span className="font-semibold">{s.prixTnd} TND</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStationChoisie(station)}
                      className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                    >
                      Réserver un créneau
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Réservations</h2>
              <button
                type="button"
                onClick={() => setOnglet("recherche")}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                + Nouvelle réservation
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-slate-500">Aucune réservation enregistrée pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">#{res.id}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            res.statut === "Confirmée"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {res.statut}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold">
                        {res.stationNom} ({res.stationVille})
                      </h3>
                      <p className="text-sm text-slate-600">
                        {res.serviceNom} • {res.vehicule}
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        📅 {res.date} à {res.heure} —{" "}
                        <span className="text-blue-600">{res.prixTnd} TND</span>
                      </p>
                    </div>
                    {res.statut === "Confirmée" && (
                      <button
                        type="button"
                        onClick={() => annulerReservation(res.id)}
                        className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {stationChoisie && (
        <ReservationModal
          station={stationChoisie}
          onClose={() => setStationChoisie(null)}
          onConfirm={ajouterReservation}
        />
      )}
    </div>
  );
}
