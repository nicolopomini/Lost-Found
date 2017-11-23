const matching = require("../controls/matching");
var issues = [
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
	},
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
	}
];
var newissue = {
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
	expect(matching(newissue, issues,1).toEqual(issues[1]));
});