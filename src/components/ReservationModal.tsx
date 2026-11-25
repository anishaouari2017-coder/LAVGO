"use client";

import React, { useState } from "react";

export type Service = {
  id: string;
  nom: string;
  prixTnd: number;
  dureeMin: number;
};

export type Station = {
  id: string;
  nom: string;
  ville: string;
  quartier: string;
  note: number;
  avis: number;
  services: Service[];
};

export type Reservation = {
  id: string;
  stationNom: string;
  stationVille: string;
  serviceNom: string;
  prixTnd: number;
  date: string;
  heure: string;
  vehicule: string;
  nomClient: string;
  telephone: string;
  statut: "Confirmée" | "Annulée";
};

type Props = {
  station: Station;
  onClose: () => void;
  onConfirm: (nouvelle: Reservation) => void;
};

const CRENEAUX = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export default function ReservationModal({ station, onClose, onConfirm }: Props) {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const premier = station.services.at(0);

  const [serviceId, setServiceId] = useState(premier ? premier.id : "");
  const [date, setDate] = useState(aujourdhui);
  const [heure, setHeure] = useState("10:00");
  const [vehicule, setVehicule] = useState("Citadine / Berline");
  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [estConfirme, setEstConfirme] = useState(false);

  const service = station.services.find((s) => s.id === serviceId) || premier;
  if (!service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      id: "RES-" + Date.now().toString().slice(-5),
      stationNom: station.nom,
      stationVille: station.ville,
      serviceNom: service.nom,
      prixTnd: service.prixTnd,
      date,
      heure,
      vehicule,
      nomClient,
      telephone,
      statut: "Confirmée",
    });
    setEstConfirme(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600">
              Réservation en ligne
            </span>
            <h3 className="text-xl font-bold text-slate-900">{station.nom}</h3>
            <p className="text-sm text-slate-500">
              {station.quartier}, {station.ville}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {estConfirme ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
              ✓
            </div>
            <h4 className="mt-4 text-xl font-bold text-slate-900">
              Réservation confirmée !
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              Merci <span className="font-semibold">{nomClient}</span>. Votre créneau est enregistré.
            </p>
            <div className="mt-5 space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm">
              <p><strong>Prestation :</strong> {service.nom}</p>
              <p><strong>Date & Heure :</strong> {date} à {heure}</p>
              <p><strong>Véhicule :</strong> {vehicule}</p>
              <p className="pt-1 font-bold text-blue-700">Total : {service.prixTnd} TND</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Terminer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">1. Prestation</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              >
                {station.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} — {s.prixTnd} TND ({s.dureeMin} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">2. Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  min={aujourdhui}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">3. Heure</label>
                <select
                  value={heure}
                  onChange={(e) => setHeure(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                >
                  {CRENEAUX.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">4. Véhicule</label>
              <select
                value={vehicule}
                onChange={(e) => setVehicule(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
              >
                <option value="Citadine / Berline">Citadine / Berline</option>
                <option value="SUV / 4x4">SUV / 4x4</option>
                <option value="Utilitaire">Utilitaire</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nom complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ahmed Ben Ali"
                  value={nomClient}
                  onChange={(e) => setNomClient(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Téléphone</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 22 123 456"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Confirmer la réservation ({service.prixTnd} TND)
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
