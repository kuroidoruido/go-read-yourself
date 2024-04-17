import { dedup, sortAlphaAsc } from "../utils/array.util";
import { NewsService } from "./news.service";

class TagsServiceImpl {
  getTags() {
    const tags = dedup(NewsService.getNews().news.flatMap((n) => n.tags));
    tags.sort(sortAlphaAsc());
    return tags;
  }
}

export const TagsService = new TagsServiceImpl();
