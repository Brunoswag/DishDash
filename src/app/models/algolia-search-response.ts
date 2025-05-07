import { Recipe } from './recipe';

export interface AlgoliaSearchHit extends Recipe {
  objectID: string;
  _highlightResult?: any;
  _snippetResult?: any;
}

export interface AlgoliaSearchResponse {
  hits: AlgoliaSearchHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS?: number;
  query?: string;
  params?: string;
}
