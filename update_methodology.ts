import fs from 'fs';
import path from 'path';

const methPath = path.resolve('./src/methodologyData.ts');
let code = fs.readFileSync(methPath, 'utf-8');

// Update the example values for Bangkok
code = code.replace(
  '{ label: "Gross income", value: "$33,500", note: "Representative city-level earnings input" }',
  '{ label: "Gross income", value: "$16,500", note: "Nominal average urban annual earnings (derived from local data)" }'
);
code = code.replace(
  '{ label: "Effective tax rate", value: "18%", note: "User-supplied country context term" }',
  '{ label: "Effective tax rate", value: "12%", note: "Estimated effective income tax rate" }'
);
code = code.replace(
  '{ label: "Essential costs", value: "$15,900", note: "Rent, utilities, transit, internet, and food" }',
  '{ label: "Essential costs", value: "$8,200", note: "Annualised local cost for rent, utilities, transit, internet, and food" }'
);
code = code.replace(
  '{ label: "PPP private consumption factor", value: "0.72", note: "World Bank PPP conversion layer" }',
  '{ label: "PPP multiplier", value: "2.4", note: "Converts nominal local purchasing power into global equivalent (based on 1 / PPP conversion factor)" }'
);
code = code.replace(
  '"DI_ppp = ((33,500 x (1 - 0.18)) - 15,900) / 0.72",\n            result: "DI_ppp = 16,069",',
  '"DI_ppp = ((16,500 x (1 - 0.12)) - 8,200) x 2.4",\n            result: "DI_ppp = 15,168",'
);

// Add the low priority dimensions
const lowPriorityText = `
    {
      eyebrow: "Negative Modifiers",
      title: "Hard Penalties for Low Priorities",
      summary: "In addition to base outcomes, the SLIC score actively subtracts significant value for conditions that undermine livability heavily. These are considered low priorities or dealbreakers for a high quality of life.",
      equations: [
        {
          id: "dealbreakers-penalty",
          title: "Low Priority Multipliers & Deductions",
          formula: "Penalty(c) = sum(severe_deficits(Violence, Hygiene, Climate, Boring, Expensive Healthcare, Bad Road Safety, Flat Experience, Horrible Food))",
          explanation: "Cities that are violent, religiously violent, unhygienic, boring (retirement home / flat experience), too cold, or have expensive healthcare, high housing prices, poor road/sidewalk safety, and high taxes with a bad return are structurally heavily penalized. These factors often drag down otherwise 'prestigious' cities.",
          citations: [1]
        }
      ]
    },
`;

code = code.replace(
  '      groups: [\n        {',
  '      groups: [\n' + lowPriorityText + '        {'
);

fs.writeFileSync(methPath, code);
