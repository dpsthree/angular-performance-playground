import { https } from 'firebase-functions';
import * as faker from 'faker';
import * as _ from 'lodash';
import * as cors from 'cors';

const colorList = [
  '#1565c0',
  '#5e92f3',
  '#003c8f',
  '#e91e63',
  '#ff6090',
  '#b0003a',
];

cors({ origin: true });

export const graphEntities = https.onCall(async (data, context) => {
  if (data && data.count) {
    const count = data.count;
    if (count >= 0 && count <= 5000) {
      return await generatedData(count);
    } else {
      return await generatedData(500);
    }
  } else {
    return await generatedData(1000);
  }
});

// use faker to create count random people
// associate them with a color and add to list
function generatedData(count: number) {
  const entities = [];
  for (let i = 0; i < count; i++) {
    entities.push({
      displayName: faker.name.findName(),
      index: i,
      color: colorList[Math.floor(Math.random() * 6)],
    });
  }

  // For each entity, make sure that they have a relationship.
  // That relationship can not be to themselves and cannot
  // equal to a relationships that was previously generated
  const relationships = [];
  for (let i = 0; i < count; i++) {
    let found = false;

    const source = entities[i];
    let target: {
      displayName: string;
      index: number;
      color: string;
    };
    do {
      target = entities[Math.floor(Math.random() * count)];
      found = !!_.find(relationships, (link) => {
        return (
          (link.source === source.displayName &&
            link.target === target.displayName) ||
          (link.source === target.displayName &&
            link.target === source.displayName) ||
          source === target
        );
      });
    } while (found);
    relationships.push({
      source: source.displayName,
      target: target.displayName,
    });
  }
  return { entities, relationships };
}
