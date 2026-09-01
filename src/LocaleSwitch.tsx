import { localeLabels } from "./siteCopy";
import type { Locale } from "./types";

const localeSwitchLabel: Record<Locale, string> = {
  en: "Language selector",
  th: "ตัวเลือกภาษา",
  zh: "语言切换",
  ko: "언어 선택",
  ja: "言語選択",
};

const LOCALES = Object.keys(localeLabels) as Locale[];

export default function LocaleSwitch({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div
      className="locale-switch"
      role="group"
      aria-label={localeSwitchLabel[locale]}
    >
      {/* Phone control. styles.css hides .locale-button-row below 768px and shows this
          instead — five 32px buttons crowd the masthead and miss the 44px floor (§11.8).
          Do not remove without also removing that media query, or phones lose every way
          to change language. */}
      <label className="locale-select-wrap">
        <span className="visually-hidden">{localeSwitchLabel[locale]}</span>
        <select
          className="locale-select"
          value={locale}
          onChange={(event) => onChange(event.target.value as Locale)}
          aria-label={localeSwitchLabel[locale]}
        >
          {LOCALES.map((option) => (
            <option key={option} value={option}>
              {localeLabels[option]}
            </option>
          ))}
        </select>
      </label>

      <div className="locale-button-row">
        {LOCALES.map((option) => (
          <button
            key={option}
            type="button"
            className={option === locale ? "locale-button active" : "locale-button"}
            onClick={() => onChange(option)}
            aria-pressed={option === locale}
            aria-label={localeLabels[option]}
          >
            <span className="locale-label-full">{localeLabels[option]}</span>
            <span className="locale-label-short">{option.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
