import getElementIndex from "./get-element-index";
import getElementParentsLength from "./get-element-parents-length";

import { HYPHEN } from "./constants";

const getElementDomId = element => getElementParentsLength(element) + HYPHEN + getElementIndex(element);

export default getElementDomId;
