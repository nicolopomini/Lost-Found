const matching = require("../models/matching");
const match = matching.match;

var issues = [
{
		description: "Portafiglio rosso di pinco pallino",
		tags:[
			{
				parsed: "pallino",
				relevance: 0.78
			},
			{
				parsed: "pinco",
				relevance: 0.80
			},
			{
				parsed: "portafiglio",
				relevance: 0.98
			},
			{
				parsed: "rosso",
				relevance: 0.96
			}
		]
	},
	{
		description: "Pinco pallino",
		tags:[
			{
				parsed: "pallino",
				relevance: 0.89
			},
			{
				parsed: "pinco",
				relevance: 0.98
			}
		]
	}
];

var newIssue = {
	description: "Trovato portafiglio rosso",
	tags:[
		{
			parsed: "portafiglio",
			relevance: 0.98
		},
		{
			parsed: "rosso",
			relevance: 0.99
		}
	]
};

test("Ricerca portafoglio", () => {
	var result = match(newIssue, issues, 1)[0];
	expect(result).toEqual(issues[0]);
});
