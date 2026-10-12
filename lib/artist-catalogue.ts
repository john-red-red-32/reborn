/**
 * General artist catalogue identity and gallery-evidence layer.
 * Identity belongs to an artist; equally named sculpts from other sculptors
 * must never be merged. Unreviewed approximate matches stay unlinked.
 */
export type ArtistGalleryEvidence = {
  artistSlug:string;
  sourceName:string;
  sourceUrl:string;
  observedAt:string;
  approxSizeInches:string|null;
  editionType:"limited"|"open"|"not_stated";
  description:string;
  /** Evidence only; must not be displayed or mirrored without usage review. */
  photoUrl:string;
  wixMediaId:string;
  matchStatus:"exact_editorial_match"|"requires_name_review";
};
export type ArtistNameAlias = {
  artistSlug:string;
  name:string;
  canonicalName:string;
  reviewState:"approved"|"pending";
  sourceUrl?:string;
};
/** Match only punctuation/case differences; fuzzy and unapproved aliases are never automatic. */
export function normalizeSculptName(name:string):string {
  return name.normalize("NFKC").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g,"");
}
export function findArtistGalleryEvidence(
  artistSlug:string,
  canonicalName:string,
  observations:readonly ArtistGalleryEvidence[],
  aliases:readonly ArtistNameAlias[]=[]
):ArtistGalleryEvidence|undefined {
  const target=normalizeSculptName(canonicalName);
  const accepted = aliases
    .filter(a=>a.artistSlug===artistSlug&&a.reviewState==="approved"&&normalizeSculptName(a.canonicalName)===target)
    .map(a=>normalizeSculptName(a.name));
  return observations.find(o=>o.artistSlug===artistSlug&&(
    (o.matchStatus==="exact_editorial_match"&&normalizeSculptName(o.sourceName)===target)
    ||(accepted.includes(normalizeSculptName(o.sourceName)))
  ));
}
export function editionTypeLabel(edition:ArtistGalleryEvidence["editionType"]):string|undefined {
  return edition==="limited"?"Limited edition":edition==="open"?"Open edition":undefined;
}
