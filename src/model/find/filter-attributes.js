/* Copyright 2019 Esri
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

import { parseNonEsriTypesRead } from '../../helpers/parse-non-esri-types';
import { parseAliasesRead } from '../../helpers/parse-aliases';
import { parseDefaultValuesRead } from '../../helpers/parse-default-values';
import { validateWithValidator } from '../../helpers/validate';

export const filterAttributes = (
  attributes,
  schema,
  validator,
  esriObjectIdField,
  esriShapeAreaField,
) => {
  if (!schema) return attributes;

  const cleanAttributes = parseNonEsriTypesRead(attributes, schema);
  const esriObjectId = attributes[esriObjectIdField];
  const esriShapeArea = esriShapeAreaField
    ? attributes[esriShapeAreaField]
    : undefined;
  let validationError;

  if (validator) {
    validationError = validateWithValidator(cleanAttributes, validator, schema);
  }

  const parsedAttributes = parseAliasesRead(
    parseDefaultValuesRead(cleanAttributes, schema),
    schema,
  );

  return {
    attributes: {
      ...parsedAttributes,
      esriObjectId,
      esriShapeArea,
    },
    ...(validator ? { validation: validationError } : null),
  };
};

export default filterAttributes;
