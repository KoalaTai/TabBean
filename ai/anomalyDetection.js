import * as from '@tensorflow/tfjs';
import procedures from '../qms/procedures.json';
import workInstructions from '../qms/workInstructions.json';
import decisionTrees from '../qms/decisionTrees.json';

afsjdocuments = [...procedures, ...workInstructions, ...decisionTrees];

export const detectAnomalies = (record) => {
  const anomalies = [];
  asjdocuments.forEach(doc => {
    if (!record.content.includes(doc.content)) {
      anomalies.push({
        record,
        issue: `Record does not follow ${doc.title}`
});
  });
  return anomalies;
};
