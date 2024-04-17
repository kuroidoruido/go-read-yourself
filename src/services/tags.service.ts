import { dedup, sortAlphaAsc } from "../utils/array.util";
import { NewsService } from "./news.service";

class TagsServiceImpl {
  getTags() {
    return dedup(NewsService.getNews().news.flatMap((n) => n.tags)).toSorted(
      sortAlphaAsc()
    );
  }
}

export const TagsService = new TagsServiceImpl();
