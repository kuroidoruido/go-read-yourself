import { dedup, sortAlphaAsc } from "../utils/array.util";
import { NewsService } from "./news.service";

export type TagScore = { name: string; score: number };
export type TagsAssociation = Record<string, TagScore[]>;

class TagsServiceImpl {
  getTags() {
    return dedup(NewsService.getNews().news.flatMap((n) => n.tags)).toSorted(
      sortAlphaAsc()
    );
  }

  getTagsAssociations(): TagsAssociation {
    const associationMap = new Map<
      string,
      { occurence: number; otherTags: Map<string, number> }
    >();

    NewsService.getNews().news.forEach(({ tags }) => {
      for (const tag of tags) {
        if (!associationMap.has(tag)) {
          associationMap.set(tag, { occurence: 1, otherTags: new Map() });
        }
        const associationCounters = associationMap.get(tag)!;
        associationCounters.occurence++;
        for (const otherTag of tags) {
          if (tag !== otherTag) {
            if (associationCounters.otherTags.has(otherTag)) {
              associationCounters.otherTags.set(
                otherTag,
                associationCounters.otherTags.get(otherTag)! + 1
              );
            } else {
              associationCounters.otherTags.set(otherTag, 1);
            }
          }
        }
      }
    });

    return Object.fromEntries(
      [...associationMap.entries()].map(([tag, { occurence, otherTags }]) => [
        tag,
        [...otherTags.entries()]
          .map(
            ([name, assocCount]): TagScore => ({
              name,
              score: Math.floor((assocCount / occurence) * 1_000),
            })
          )
          .filter(({ score }) => score > 250)
          .toSorted(({ score: a }, { score: b }) => a - b),
      ])
    );
  }
}

export const TagsService = new TagsServiceImpl();
