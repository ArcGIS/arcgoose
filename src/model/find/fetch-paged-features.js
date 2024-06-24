/* Copyright 2021 Esri
 * Michael Van den Bergh
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { requestWithRetry } from '../../helpers/request-with-retry';

export const fetchPagedFeatures = async (
  url,
  authentication,
  query,
  inputTime,
) => {
  let { resultOffset = 0, resultRecordCount } = query;
  let features = [];
  let result;

  do {
    // eslint-disable-next-line no-await-in-loop
    result = await requestWithRetry(
      url,
      authentication,
      { ...query, resultOffset, resultRecordCount },
      inputTime,
    );

    features = features.concat(result.features);

    resultOffset += result.features.length;
    if (resultRecordCount !== undefined) {
      resultRecordCount -= features.length;
    }
  } while (
    result.exceededTransferLimit &&
    (resultRecordCount > 0 || resultRecordCount === undefined)
  );

  const { spatialReference, objectIdFieldName } = result;

  return {
    features,
    spatialReference,
    objectIdFieldName,
  };
};

export default fetchPagedFeatures;
