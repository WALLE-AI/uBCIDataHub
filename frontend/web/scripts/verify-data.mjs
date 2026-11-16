import assert from 'node:assert/strict';
import {datasets,scenes,filterDatasets} from '../assets/datasets.js';
const query=s=>filterDatasets(datasets,new URLSearchParams(s)).map(d=>d.id);
assert.deepEqual(query('q=运动想象'),['stroke-mi']);
assert.deepEqual(query('modality=EEG&modality=LFP&disease=帕金森病'),['parkinson-lfp']);
assert.deepEqual(query('access=注册访问'),['parkinson-lfp']);
assert.deepEqual(query('q=不存在的资源'),[]);
assert.deepEqual(query('follow=1&modality=fNIRS'),[]);
assert.equal(query('sort=updated')[0],'stroke-mi');
assert.deepEqual(query('minSubjects=40'),['stroke-mi']);
assert.deepEqual(query('minRate=200'),['epilepsy-ieeg']);
assert.equal(new Set(datasets.map(d=>d.id)).size,datasets.length);
assert(datasets.every(d=>!d.sample&&d.version&&d.license&&new URL(d.url).protocol==='https:'));
assert.equal(scenes.length,6);
for(const scene of scenes){assert.equal(query('q='+encodeURIComponent(scene.query)).length,1);assert.equal(query('scene='+encodeURIComponent(scene.name)).length,1);}
console.log('PASS: six scene mappings, external sources, unknown metadata exclusion, filters and empty state.');
