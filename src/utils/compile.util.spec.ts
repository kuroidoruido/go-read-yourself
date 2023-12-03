import { describe, expect, it } from "vitest";
import { compilePostsAsFormattedMarkdown } from "./compile.util";

describe(compilePostsAsFormattedMarkdown.name, () => {
  it("should format correctly a news set", () => {
    const actual = compilePostsAsFormattedMarkdown(NEWS);
    const expected = `### [Smartphones With Popular Qualcomm Chip Secretly Share Private Information With US Chip-Maker](https://www.nitrokey.com/news/2023/smartphones-popular-qualcomm-chip-secretly-share-private-information-us-chip-maker)
\\#Sécurité #Qualcomm #Vie-privée

Au moins une partie des puces Qualcomm envoie des infos d'elles même sans passer par l'OS vers des serveurs de Qualcomm, le tout sans consentement.

On parle souvent d'espionnage chinois mais l'espionnage américain on en parle ?


### [Comment Facebook et Instagram servent à orchestrer le trafic sexuel de mineurs](https://www.madmoizelle.com/comment-facebook-et-instagram-servent-a-orchestrer-le-trafic-sexuel-de-mineurs-1523717)
\\#Réseaux-sociaux #Trafic-sexuel #Mineur #Pédophilie #Divers

Sujet qui sort un peu de l'edito mais faites attention à votre entourage, en particulier les enfants et ados, par rapport aux réseaux sociaux qui sont exploités très fortement pour trafic de mineur avec des gros réseaux très bien orchestrés


### [Google Authenticator – Attention à la synchronisation des données 2FA !!](https://korben.info/google-authenticator-synchronisation-donnees-2fa.html)
\\#Sécurité #2FA #Google

Google vient de proposer la synchronisation via son compte Google des données de 2FA (Authentification à 2 Facteurs)... Et même pas en chiffrement bout en bout... Du génie !

Pour rappel : les infos 2FA (typiquement le code OTP qu'on a avec Google Authentificator) c'est un moyen de prouver qu'on possède un objet (contrairement au mot de passe qui est une preuve de connaissance), si vous le synchronisez sur un cloud ça prouve plus rien du tout. Et si c'est fait sans le bon niveau de chiffrement, là ça va forcément finir par leak et ne plus servir à rien

Bon bah plus qu'à trouver une autre app pour dégager Google Authentificator...


### [La spécification ECMAScript 2023 pour JavaScript inclut de nouvelles méthodes pour les tableaux, notamment la possibilité de rechercher un élément dans un tableau à partir de la fin du tableau](https://javascript.developpez.com/actu/343360/La-specification-ECMAScript-2023-pour-JavaScript-inclut-de-nouvelles-methodes-pour-les-tableaux-notamment-la-possibilite-de-rechercher-un-element-dans-un-tableau-a-partir-de-la-fin-du-tableau/)
\\#ECMAScript #JavaScript #TypeScript #Frontend #Backend

La spec 2023 de JavaScript vient de tomber, on y trouve des petites nouveautés mais rien de bien fou. Mais y'a sans doute des choses qui sont des gros attendus pour les développeurs de framework
`;
    expect(actual).toEqual(expected);
  });
});

const NEWS = [
  {
    id: "uIw3AbFh5C",
    url: "https://javascript.developpez.com/actu/343360/La-specification-ECMAScript-2023-pour-JavaScript-inclut-de-nouvelles-methodes-pour-les-tableaux-notamment-la-possibilite-de-rechercher-un-element-dans-un-tableau-a-partir-de-la-fin-du-tableau/",
    content:
      "La spec 2023 de JavaScript vient de tomber, on y trouve des petites nouveautés mais rien de bien fou. Mais y'a sans doute des choses qui sont des gros attendus pour les développeurs de framework",
    title:
      "La spécification ECMAScript 2023 pour JavaScript inclut de nouvelles méthodes pour les tableaux, notamment la possibilité de rechercher un élément dans un tableau à partir de la fin du tableau",
    tags: ["ECMAScript", "JavaScript", "TypeScript", "Frontend", "Backend"],
    creationDate: "2023-05-01T19:39:33+02:00",
  },
  {
    id: "SNPuAajVmz",
    url: "https://korben.info/google-authenticator-synchronisation-donnees-2fa.html",
    content:
      "Google vient de proposer la synchronisation via son compte Google des données de 2FA (Authentification à 2 Facteurs)... Et même pas en chiffrement bout en bout... Du génie !\r\n\r\nPour rappel : les infos 2FA (typiquement le code OTP qu'on a avec Google Authentificator) c'est un moyen de prouver qu'on possède un objet (contrairement au mot de passe qui est une preuve de connaissance), si vous le synchronisez sur un cloud ça prouve plus rien du tout. Et si c'est fait sans le bon niveau de chiffrement, là ça va forcément finir par leak et ne plus servir à rien\r\n\r\nBon bah plus qu'à trouver une autre app pour dégager Google Authentificator...",
    title:
      "Google Authenticator – Attention à la synchronisation des données 2FA !!",
    tags: ["Sécurité", "2FA", "Google"],
    creationDate: "2023-05-01T19:38:13+02:00",
  },
  {
    id: "pCGnpEYdHD",
    url: "https://www.madmoizelle.com/comment-facebook-et-instagram-servent-a-orchestrer-le-trafic-sexuel-de-mineurs-1523717",
    content:
      "Sujet qui sort un peu de l'edito mais faites attention à votre entourage, en particulier les enfants et ados, par rapport aux réseaux sociaux qui sont exploités très fortement pour trafic de mineur avec des gros réseaux très bien orchestrés",
    title:
      "Comment Facebook et Instagram servent à orchestrer le trafic sexuel de mineurs",
    tags: [
      "Réseaux sociaux",
      "Trafic sexuel",
      "Mineur",
      "Pédophilie",
      "Divers",
    ],
    creationDate: "2023-05-01T19:37:40+02:00",
  },
  {
    id: "e3HHz1AL8y",
    url: "https://www.nitrokey.com/news/2023/smartphones-popular-qualcomm-chip-secretly-share-private-information-us-chip-maker",
    content:
      "Au moins une partie des puces Qualcomm envoie des infos d'elles même sans passer par l'OS vers des serveurs de Qualcomm, le tout sans consentement.\r\n\r\nOn parle souvent d'espionnage chinois mais l'espionnage américain on en parle ?",
    title:
      "Smartphones With Popular Qualcomm Chip Secretly Share Private Information With US Chip-Maker",
    tags: ["Sécurité", "Qualcomm", "Vie privée"],
    creationDate: "2023-05-01T19:36:53+02:00",
  },
];
