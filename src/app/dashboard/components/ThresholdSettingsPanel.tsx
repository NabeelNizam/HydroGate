"use client";

import { FormEvent, useState } from "react";
import { Save, SlidersHorizontal } from "lucide-react";

type ThresholdForm = {
  water_siaga: number;
  water_bahaya: number;
  hcsr_bahaya_cm: number;
  hcsr_siaga_cm: number;
};

const DEFAULT_THRESHOLDS: ThresholdForm = {
  water_siaga: 1000,
  water_bahaya: 1600,
  hcsr_bahaya_cm: 10,
  hcsr_siaga_cm: 20,
};

function validateThresholds(values: ThresholdForm) {
  if (values.water_siaga < 0 || values.water_siaga > 4095) {
    return "Water level siaga harus berada di range 0 sampai 4095";
  }

  if (values.water_bahaya < 0 || values.water_bahaya > 4095) {
    return "Water level bahaya harus berada di range 0 sampai 4095";
  }

  if (values.hcsr_bahaya_cm < 0 || values.hcsr_bahaya_cm > 400) {
    return "HC-SR04 jarak bahaya harus berada di range 0 sampai 400 cm";
  }

  if (values.hcsr_siaga_cm < 0 || values.hcsr_siaga_cm > 400) {
    return "HC-SR04 jarak siaga harus berada di range 0 sampai 400 cm";
  }

  if (values.water_bahaya < values.water_siaga) {
    return "Water level bahaya tidak boleh lebih kecil dari water level siaga";
  }

  if (values.hcsr_siaga_cm < values.hcsr_bahaya_cm) {
    return "HC-SR04 jarak siaga tidak boleh lebih kecil dari jarak bahaya";
  }

  return "";
}

export default function ThresholdSettingsPanel() {
  const [values, setValues] = useState<ThresholdForm>(DEFAULT_THRESHOLDS);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateValue = (key: keyof ThresholdForm, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: Number(value),
    }));
    setMessage("");
    setError("");
  };

  const submitThresholds = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationMessage = validateThresholds(values);

    if (validationMessage) {
      setError(validationMessage);
      setMessage("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch("/api/gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: "SET_THRESHOLDS",
          ...values,
        }),
      });

      const json: { error?: string; detail?: string } = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || json.error || "Gagal menyimpan threshold");
      }

      setMessage("Threshold berhasil dikirim ke MQTT");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan threshold");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Setting Threshold Sensor
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Publish ke topic hydrogate/gate/control
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
          <SlidersHorizontal size={22} />
        </div>
      </div>

      <form onSubmit={submitThresholds} className="space-y-4">
        <NumberField
          label="Water level siaga"
          value={values.water_siaga}
          min={0}
          max={4095}
          onChange={(value) => updateValue("water_siaga", value)}
        />
        <NumberField
          label="Water level bahaya/merah"
          value={values.water_bahaya}
          min={0}
          max={4095}
          onChange={(value) => updateValue("water_bahaya", value)}
        />
        <NumberField
          label="HC-SR04 jarak bahaya dalam cm"
          value={values.hcsr_bahaya_cm}
          min={0}
          max={400}
          onChange={(value) => updateValue("hcsr_bahaya_cm", value)}
        />
        <NumberField
          label="HC-SR04 jarak siaga dalam cm"
          value={values.hcsr_siaga_cm}
          min={0}
          max={400}
          onChange={(value) => updateValue("hcsr_siaga_cm", value)}
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
        >
          <Save size={17} />
          {submitting ? "Menyimpan..." : "Simpan Threshold"}
        </button>
      </form>
    </section>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        min={min}
        max={max}
        step={1}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />
    </label>
  );
}
