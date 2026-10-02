import { useEffect, useState, useRef } from "react";
import { X, Check, Pipette } from "lucide-react";
import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
} from "../../utils/categoryIcons";
import { isFallbackAttribute } from "../../services/api";

const PRESET_COLOURS = [
  { name: "Black", hex: "#000000" },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "White", hex: "#ffffff" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Silver", hex: "#9ca3af" },
  { name: "Brown", hex: "#78350f" },
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#10b981" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Orange", hex: "#f97316" },
];

const AttributeModal = ({ isOpen, onClose, onSave, type, editing }) => {
  const isColour = type === "colour";

  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [icon, setIcon] = useState(DEFAULT_CATEGORY_ICON);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const nativeColorInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(editing?.name ?? "");
    setHex(editing?.hex ?? "#000000");
    setIcon(editing?.icon ?? DEFAULT_CATEGORY_ICON);
    setError("");
    setIsSaving(false);
  }, [isOpen, editing]);

  if (!isOpen) return null;

  const lockName = Boolean(editing) && isFallbackAttribute(editing.name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        name: trimmed,
        ...(isColour ? { hex } : { icon }),
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPreset = (presetHex, presetName) => {
    setHex(presetHex);
    if (!name || PRESET_COLOURS.some((p) => p.name === name)) {
      setName(presetName);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-background rounded-lg border border-border w-full max-w-md p-6 max-h-[90vh] overflow-y-auto admin-scrollbar shadow-lg">
        <div className="flex items-start justify-between">
          <h2 className="text-heading-2 font-bold text-text-primary">
            {editing ? "Edit" : "Add"} {isColour ? "Colour" : "Category"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
            className="border border-border rounded-lg p-2 text-text-secondary hover:bg-background-subtle shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <label
            htmlFor="attribute-name"
            className="text-body-md text-text-primary font-medium"
          >
            {isColour ? "Colour Name" : "Category Name"}
          </label>

          {isColour ? (
            <div className="mt-2 space-y-4">
              {/* Input field with selected preview swatch */}
              <div className="flex h-12 items-center gap-3 rounded-lg border border-border px-4 focus-within:ring-2 focus-within:ring-primary bg-background">
                <div
                  className="w-6 h-6 rounded-md shrink-0 border border-border shadow-sm transition-colors"
                  style={{
                    background:
                      name.trim().toLowerCase() === "other"
                        ? "conic-gradient(from 180deg, #ef4444, #f97316, #eab308, #10b981, #3b82f6, #8b5cf6, #ef4444)"
                        : hex,
                  }}
                />
                <input
                  id="attribute-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={lockName}
                  maxLength={30}
                  placeholder="e.g. Black"
                  autoFocus
                  className={`min-w-0 flex-1 bg-transparent text-body-lg font-semibold outline-none placeholder:font-normal placeholder:text-text-secondary ${
                    lockName ? "text-text-secondary" : "text-text-primary"
                  }`}
                />
                <div className="flex items-center gap-1.5 shrink-0 border-l border-border pl-3">
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    maxLength={7}
                    className="w-16 text-body-sm uppercase font-mono text-text-secondary bg-transparent outline-none text-right"
                  />
                  <button
                    type="button"
                    onClick={() => nativeColorInputRef.current?.click()}
                    title="Pick custom colour"
                    className="p-1 text-text-secondary hover:text-primary transition-colors"
                  >
                    <Pipette size={16} />
                  </button>
                  <input
                    ref={nativeColorInputRef}
                    type="color"
                    value={hex.length === 7 ? hex : "#000000"}
                    onChange={(e) => setHex(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>

              {/* Preset Color Selection Grid */}
              <div>
                <p className="text-body-sm text-text-secondary mb-2 font-medium">
                  Quick Presets
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLOURS.map((preset) => {
                    const isSelected =
                      hex.toLowerCase() === preset.hex.toLowerCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() =>
                          handleSelectPreset(preset.hex, preset.name)
                        }
                        title={preset.name}
                        className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            className={
                              preset.hex === "#ffffff" ||
                              preset.hex === "#f97316" ||
                              preset.hex === "#eab308"
                                ? "text-text-primary"
                                : "text-white"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <input
              id="attribute-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={lockName}
              maxLength={30}
              placeholder="e.g. Sports gear"
              autoFocus
              className={`mt-2 w-full rounded-lg border border-border px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary ${
                lockName ? "text-text-secondary" : "text-text-primary"
              }`}
            />
          )}

          {lockName && (
            <p className="mt-2 text-label-sm text-text-secondary">
              This is the fallback value, so its name can't be changed.
            </p>
          )}

          {/* Icon picker — categories only */}
          {!isColour && (
            <div className="mt-5">
              <p className="text-body-md text-text-primary font-medium">Icon</p>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {CATEGORY_ICONS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={icon === key}
                    onClick={() => setIcon(key)}
                    className={`flex h-11 items-center justify-center rounded-lg border transition-colors ${
                      icon === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-text-secondary hover:bg-background-subtle hover:text-text-primary"
                    }`}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-body-sm text-error">{error}</p>}

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg border border-border px-6 py-2.5 text-body-md text-text-primary transition-colors hover:bg-background-subtle disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="rounded-lg bg-primary px-8 py-2.5 text-body-md font-medium text-text-inverse transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttributeModal;
