/** Fully source-backed, predominantly photo-pending original sculpts.
 * Never treat records as confirmed live inventory or publish guessed photos.
 */
import type {VerifiedKit} from "./real-catalogue";
import {indexedKitsDawnLaura} from "./indexed-kits-dawn-laura";
import {indexedKitsSabine} from "./indexed-kits-sabine";
import {indexedKitsGudrun} from "./indexed-kits-gudrun";
import {indexedKitsPhil} from "./indexed-kits-philomena";
import {indexedKitsAlejandra} from "./indexed-kits-alejandra";
import {indexedKitsSeverine} from "./indexed-kits-severine";
export const indexedOriginalKits:VerifiedKit[]=[
 ...indexedKitsDawnLaura,...indexedKitsSabine,...indexedKitsGudrun,
 ...indexedKitsPhil,...indexedKitsAlejandra,...indexedKitsSeverine
];
