/** Dealer-referenced historical originals; links represent evidence rather
 * than a claim that the sculptor owns/endorses any particular retailer.
 * No images assigned or live offers inferred.
 */
import type {VerifiedKit} from "./real-catalogue";
import {retailerKitsEllyIveta} from "./retailer-kits-elly-iveta";
import {retailerKitsOlga} from "./retailer-kits-olga";
import {retailerKitsSabrina} from "./retailer-kits-sabrina";
import {retailerKitsPing} from "./retailer-kits-ping";
import {retailerKitsLauraLee} from "./retailer-kits-lauralee";
export const retailerProvenanceKits:VerifiedKit[]=[
 ...retailerKitsEllyIveta,...retailerKitsOlga,...retailerKitsSabrina,
 ...retailerKitsPing,...retailerKitsLauraLee
];
