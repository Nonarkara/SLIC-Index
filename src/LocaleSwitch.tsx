import { localeLabels } from "./siteCopy";
import type { Locale } from "./types";

const localeSwitchLabel: Record<Locale, string> = {
  en: "Language selector",
  th: "ตัวเลือกภาษา",
  zh: "语言切换",
  ko: "언어 선택",
  ja: "言語選択",
};

export default function LocaleSwitch({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="locale-switch" role="group" aria-label={localeSwitchLabel[locale]}>
      {(Object.keys(localeLabels) as Locale[]).map((option) => (
        <button
          key={option}
          type="button"
          className={option === locale ? "locale-button active" : "locale-button"}
          onClick={() => onChange(option)}
          aria-pressed={option === locale}
        >
          <span className="locale-label-full">{localeLabels[option]}</span>
          <span className="locale-label-short">{option.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
