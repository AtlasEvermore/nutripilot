// NutriPilot exercise library extension + animated movement demos (SVG/SMIL stick figures).
// Names and cues are French source keys translated through i18n.js.

export const EQUIPMENT = { bar: 'Barre', db: 'Haltères', machine: 'Machine', cable: 'Poulie', bw: 'Poids du corps', band: 'Élastique', cardio: 'Cardio' };

// id: { name, muscle, group, equip, home, cues }
export const EXTRA_EXERCISES = {
  'incline-bench': { name: 'Développé incliné (barre)', muscle: 'Haut des pectoraux', group: 'Pectoraux', equip: 'bar', cues: ['Banc incliné à 30°, omoplates serrées.', 'Descendez la barre sous les clavicules.', 'Poussez en ligne droite au-dessus des épaules.'] },
  'decline-bench': { name: 'Développé décliné', muscle: 'Bas des pectoraux', group: 'Pectoraux', equip: 'bar', cues: ['Jambes bien calées sous les boudins.', 'Descendez la barre vers le bas des pectoraux.', 'Gardez les coudes à 45° du corps.'] },
  'db-bench': { name: 'Développé couché haltères', muscle: 'Pectoraux', group: 'Pectoraux', equip: 'db', home: true, cues: ['Haltères au niveau de la poitrine, paumes vers les pieds.', 'Poussez en rapprochant légèrement les haltères.', 'Descendez lentement jusqu’à l’étirement.'] },
  'db-fly': { name: 'Écarté couché haltères', muscle: 'Pectoraux', group: 'Pectoraux', equip: 'db', home: true, cues: ['Coudes légèrement fléchis du début à la fin.', 'Ouvrez les bras jusqu’à sentir l’étirement.', 'Refermez comme pour enlacer un arbre.'] },
  'pec-deck': { name: 'Pec deck (butterfly)', muscle: 'Pectoraux', group: 'Pectoraux', equip: 'machine', cues: ['Poignées à hauteur de poitrine.', 'Rapprochez les bras en contractant.', 'Revenez sans laisser les charges se toucher.'] },
  'incline-pushup': { name: 'Pompes inclinées (mains surélevées)', muscle: 'Pectoraux, triceps', group: 'Pectoraux', equip: 'bw', home: true, cues: ['Mains sur un banc ou une table stable.', 'Corps aligné de la tête aux talons.', 'Plus le support est haut, plus c’est facile.'] },
  'deadlift': { name: 'Soulevé de terre', muscle: 'Dos, fessiers, ischio-jambiers', group: 'Dos', equip: 'bar', cues: ['Barre au-dessus du milieu du pied, dos plat.', 'Poussez le sol avec les jambes en gardant la barre contre vous.', 'Verrouillez hanches et genoux ensemble en haut.'] },
  'chin-up': { name: 'Tractions supination', muscle: 'Dos, biceps', group: 'Dos', equip: 'bw', cues: ['Paumes vers vous, largeur d’épaules.', 'Montez jusqu’à passer le menton au-dessus de la barre.', 'Descendez bras presque tendus.'] },
  'close-pulldown': { name: 'Tirage vertical prise serrée', muscle: 'Dos (grand dorsal)', group: 'Dos', equip: 'cable', cues: ['Poignée triangle, buste légèrement incliné.', 'Tirez vers le haut de la poitrine.', 'Contrôlez la remontée.'] },
  'db-row': { name: 'Rowing haltère un bras', muscle: 'Dos', group: 'Dos', equip: 'db', home: true, cues: ['Main et genou en appui sur un banc.', 'Tirez l’haltère vers la hanche.', 'Gardez le dos plat et immobile.'] },
  't-bar-row': { name: 'Rowing T-bar', muscle: 'Dos (épaisseur)', group: 'Dos', equip: 'bar', cues: ['Buste incliné à 45°, dos plat.', 'Tirez la poignée vers le ventre.', 'Serrez les omoplates en haut.'] },
  'machine-row': { name: 'Rowing machine', muscle: 'Dos', group: 'Dos', equip: 'machine', cues: ['Poitrine contre l’appui.', 'Tirez les coudes vers l’arrière.', 'Revenez lentement.'] },
  'pullover': { name: 'Pull-over à la poulie (bras tendus)', muscle: 'Grand dorsal', group: 'Dos', equip: 'cable', cues: ['Bras presque tendus, buste légèrement penché.', 'Ramenez la barre vers les cuisses.', 'Remontez en contrôlant l’étirement.'] },
  'back-ext': { name: 'Extension lombaire (banc à 45°)', muscle: 'Bas du dos, fessiers', group: 'Dos', equip: 'machine', cues: ['Hanches au bord du support.', 'Descendez dos plat.', 'Remontez jusqu’à l’alignement, sans hyper-extension.'] },
  'shrug': { name: 'Haussements d’épaules', muscle: 'Trapèzes', group: 'Dos', equip: 'db', home: true, cues: ['Bras tendus, charges le long du corps.', 'Montez les épaules vers les oreilles.', 'Pause 1 seconde, descendez lentement.'] },
  'band-row': { name: 'Tirage à l’élastique', muscle: 'Dos', group: 'Dos', equip: 'band', home: true, cues: ['Élastique accroché à hauteur de poitrine.', 'Tirez les coudes vers l’arrière.', 'Serrez les omoplates.'] },
  'inverted-row': { name: 'Rowing inversé', muscle: 'Dos, biceps', group: 'Dos', equip: 'bw', home: true, cues: ['Sous une barre basse ou une table solide.', 'Corps gainé, tirez la poitrine vers la barre.', 'Pieds plus avancés = plus difficile.'] },
  'barbell-ohp': { name: 'Développé militaire (barre)', muscle: 'Épaules', group: 'Épaules', equip: 'bar', cues: ['Barre sur le haut de la poitrine, fessiers serrés.', 'Poussez au-dessus de la tête en reculant la tête.', 'Ne cambrez pas le bas du dos.'] },
  'arnold': { name: 'Développé Arnold', muscle: 'Épaules', group: 'Épaules', equip: 'db', home: true, cues: ['Départ paumes vers vous devant le visage.', 'Tournez les poignets en poussant vers le haut.', 'Inversez le mouvement en descendant.'] },
  'front-raise': { name: 'Élévations frontales', muscle: 'Avant des épaules', group: 'Épaules', equip: 'db', home: true, cues: ['Bras presque tendus.', 'Montez jusqu’à hauteur des yeux.', 'Descendez sans élan.'] },
  'upright-row': { name: 'Tirage menton prise large', muscle: 'Épaules, trapèzes', group: 'Épaules', equip: 'bar', cues: ['Prise plus large que les épaules.', 'Montez les coudes jusqu’à hauteur d’épaules.', 'Arrêtez avant toute gêne.'] },
  'machine-shoulder': { name: 'Développé épaules à la machine', muscle: 'Épaules', group: 'Épaules', equip: 'machine', cues: ['Poignées à hauteur d’épaules.', 'Poussez sans verrouiller les coudes.', 'Dos collé au dossier.'] },
  'pike-pushup': { name: 'Pompes piquées', muscle: 'Épaules, triceps', group: 'Épaules', equip: 'bw', home: true, cues: ['Hanches hautes, corps en V inversé.', 'Descendez la tête vers le sol entre les mains.', 'Poussez pour remonter.'] },
  'barbell-curl': { name: 'Curl barre', muscle: 'Biceps', group: 'Bras', equip: 'bar', cues: ['Coudes fixes contre le corps.', 'Montez sans balancer le buste.', 'Descendez en 2 à 3 secondes.'] },
  'preacher-curl': { name: 'Curl au pupitre', muscle: 'Biceps', group: 'Bras', equip: 'machine', cues: ['Bras bien à plat sur le pupitre.', 'Montez sans décoller les coudes.', 'Ne tendez pas brusquement en bas.'] },
  'concentration-curl': { name: 'Curl concentré', muscle: 'Biceps', group: 'Bras', equip: 'db', home: true, cues: ['Assis, coude contre l’intérieur de la cuisse.', 'Montez lentement en tournant le petit doigt vers le haut.', 'Pause en haut.'] },
  'cable-curl': { name: 'Curl à la poulie', muscle: 'Biceps', group: 'Bras', equip: 'cable', cues: ['Poulie basse, coudes fixes.', 'Montez en contractant.', 'Tension constante pendant la descente.'] },
  'skullcrusher': { name: 'Barre au front', muscle: 'Triceps', group: 'Bras', equip: 'bar', cues: ['Allongé(e), bras verticaux.', 'Pliez les coudes pour descendre la barre vers le front.', 'Tendez sans écarter les coudes.'] },
  'rope-pushdown': { name: 'Extension triceps à la corde', muscle: 'Triceps', group: 'Bras', equip: 'cable', cues: ['Coudes collés au corps.', 'Écartez la corde en bas du mouvement.', 'Remontez jusqu’à 90°.'] },
  'close-bench': { name: 'Développé couché prise serrée', muscle: 'Triceps, pectoraux', group: 'Bras', equip: 'bar', cues: ['Mains largeur d’épaules.', 'Coudes près du corps à la descente.', 'Poussez en verrouillant les bras.'] },
  'kickback': { name: 'Kickback triceps', muscle: 'Triceps', group: 'Bras', equip: 'db', home: true, cues: ['Buste penché, bras collé au corps.', 'Tendez l’avant-bras vers l’arrière.', 'Pause bras tendu.'] },
  'bench-dips': { name: 'Dips entre deux chaises', muscle: 'Triceps', group: 'Bras', equip: 'bw', home: true, cues: ['Mains sur le bord d’un banc ou d’une chaise stable.', 'Descendez jusqu’à 90° aux coudes.', 'Gardez le dos près du support.'] },
  'front-squat': { name: 'Squat avant', muscle: 'Quadriceps', group: 'Jambes', equip: 'bar', cues: ['Barre sur l’avant des épaules, coudes hauts.', 'Buste très droit à la descente.', 'Remontez en poussant dans tout le pied.'] },
  'hack-squat': { name: 'Hack squat', muscle: 'Quadriceps', group: 'Jambes', equip: 'machine', cues: ['Dos collé au dossier.', 'Descendez jusqu’à 90° ou plus si confortable.', 'Poussez sans décoller les talons.'] },
  'smith-squat': { name: 'Squat à la Smith machine', muscle: 'Quadriceps, fessiers', group: 'Jambes', equip: 'machine', cues: ['Pieds légèrement en avant de la barre.', 'Descendez en gardant le dos neutre.', 'Remontez en contrôlant.'] },
  'sumo-squat': { name: 'Squat sumo haltère', muscle: 'Adducteurs, fessiers', group: 'Jambes', equip: 'db', home: true, cues: ['Pieds larges, pointes ouvertes.', 'Haltère tenu entre les jambes.', 'Genoux dans l’axe des orteils.'] },
  'reverse-lunge': { name: 'Fentes arrière', muscle: 'Quadriceps, fessiers', group: 'Jambes', equip: 'bw', home: true, cues: ['Grand pas en arrière.', 'Genou arrière près du sol.', 'Revenez en poussant sur le talon avant.'] },
  'seated-leg-curl': { name: 'Leg curl assis', muscle: 'Ischio-jambiers', group: 'Jambes', equip: 'machine', cues: ['Cuisses bien bloquées.', 'Fléchissez complètement.', 'Revenez lentement.'] },
  'good-morning': { name: 'Good morning', muscle: 'Ischio-jambiers, bas du dos', group: 'Jambes', equip: 'bar', cues: ['Barre sur le haut du dos, genoux souples.', 'Penchez le buste en poussant les hanches en arrière.', 'Charge légère, dos toujours plat.'] },
  'sumo-deadlift': { name: 'Soulevé de terre sumo', muscle: 'Fessiers, adducteurs', group: 'Fessiers', equip: 'bar', cues: ['Pieds très écartés, mains à l’intérieur des jambes.', 'Poitrine haute, dos plat.', 'Poussez le sol vers l’extérieur.'] },
  'seated-calf': { name: 'Mollets assis', muscle: 'Mollets (soléaire)', group: 'Jambes', equip: 'machine', cues: ['Genoux sous l’appui.', 'Montez sur la pointe des pieds.', 'Étirez bien en bas.'] },
  'adduction': { name: 'Adduction à la machine', muscle: 'Adducteurs', group: 'Jambes', equip: 'machine', cues: ['Dos collé au dossier.', 'Rapprochez les jambes en contrôlant.', 'Revenez lentement.'] },
  'jump-squat': { name: 'Squats sautés', muscle: 'Jambes, cardio', group: 'Cardio', equip: 'bw', home: true, cues: ['Descendez en squat.', 'Sautez de façon explosive.', 'Réception souple, genoux fléchis.'] },
  'cable-kickback': { name: 'Kickback fessier à la poulie', muscle: 'Fessiers', group: 'Fessiers', equip: 'cable', cues: ['Sangle à la cheville, buste penché.', 'Poussez la jambe vers l’arrière.', 'Serrez le fessier sans cambrer.'] },
  'donkey-kick': { name: 'Donkey kicks', muscle: 'Fessiers', group: 'Fessiers', equip: 'bw', home: true, cues: ['À quatre pattes.', 'Montez un pied vers le plafond, genou plié.', 'Serrez le fessier en haut.'] },
  'single-rdl': { name: 'Soulevé de terre une jambe', muscle: 'Fessiers, ischio-jambiers, équilibre', group: 'Fessiers', equip: 'db', home: true, cues: ['En appui sur une jambe, genou souple.', 'Penchez le buste, jambe libre vers l’arrière.', 'Remontez en serrant le fessier.'] },
  'side-plank': { name: 'Gainage latéral', muscle: 'Obliques', group: 'Abdos & gainage', equip: 'bw', home: true, cues: ['Coude sous l’épaule.', 'Hanches hautes, corps aligné.', 'Tenez en respirant.'] },
  'crunch': { name: 'Crunch', muscle: 'Abdominaux', group: 'Abdos & gainage', equip: 'bw', home: true, cues: ['Bas du dos au sol.', 'Enroulez le haut du dos en expirant.', 'Ne tirez pas sur la nuque.'] },
  'cable-crunch': { name: 'Crunch à la poulie', muscle: 'Abdominaux', group: 'Abdos & gainage', equip: 'cable', cues: ['À genoux, corde derrière la tête.', 'Enroulez le buste vers le sol.', 'Les hanches restent fixes.'] },
  'hanging-raise': { name: 'Relevés de jambes suspendu', muscle: 'Abdominaux', group: 'Abdos & gainage', equip: 'bw', cues: ['Suspendu(e) à une barre, épaules actives.', 'Montez les genoux ou les jambes sans balancer.', 'Descendez lentement.'] },
  'russian-twist': { name: 'Rotations russes', muscle: 'Obliques', group: 'Abdos & gainage', equip: 'bw', home: true, cues: ['Assis(e), buste incliné en arrière.', 'Tournez les épaules de chaque côté.', 'Dos droit, pieds au sol si besoin.'] },
  'ab-wheel': { name: 'Roue abdominale', muscle: 'Abdominaux', group: 'Abdos & gainage', equip: 'bw', home: true, cues: ['À genoux, roue sous les épaules.', 'Avancez en gardant le dos plat.', 'Revenez en contractant les abdominaux.'] },
  'bicycle': { name: 'Crunch vélo', muscle: 'Abdominaux, obliques', group: 'Abdos & gainage', equip: 'bw', home: true, cues: ['Mains aux tempes.', 'Coude vers le genou opposé.', 'Alternez lentement.'] },
  'treadmill': { name: 'Tapis de course', muscle: 'Cardio', group: 'Cardio', equip: 'cardio', cues: ['Commencez par 5 minutes de marche.', 'Alternez 1 minute rapide, 2 minutes calmes.', 'Restez droit(e), sans tenir les barres.'] },
  'bike': { name: 'Vélo', muscle: 'Cardio, jambes', group: 'Cardio', equip: 'cardio', home: true, cues: ['Selle à hauteur de hanche.', 'Genou légèrement fléchi en bas.', 'Cadence régulière.'] },
  'rower': { name: 'Rameur', muscle: 'Cardio, dos, jambes', group: 'Cardio', equip: 'cardio', cues: ['Poussez d’abord avec les jambes.', 'Puis basculez le buste et tirez les bras.', 'Revenez dans l’ordre inverse.'] },
  'elliptical': { name: 'Vélo elliptique', muscle: 'Cardio', group: 'Cardio', equip: 'cardio', cues: ['Buste droit.', 'Poussez et tirez avec les bras.', 'Résistance modérée.'] },
  'burpees': { name: 'Burpees', muscle: 'Cardio, corps entier', group: 'Cardio', equip: 'bw', home: true, cues: ['Mains au sol, pieds en arrière.', 'Ramenez les pieds puis sautez.', 'Version douce : sans saut ni pompe.'] },
  'stairs': { name: 'Escaliers ou stepper', muscle: 'Cardio, fessiers', group: 'Cardio', equip: 'cardio', home: true, cues: ['Posez tout le pied sur la marche.', 'Rythme régulier.', 'Aidez-vous de la rampe si besoin.'] },
  'thoracic-rot': { name: 'Rotations thoraciques', muscle: 'Mobilité du haut du dos', group: 'Mobilité & équilibre', equip: 'bw', home: true, cues: ['À quatre pattes, une main derrière la tête.', 'Tournez le coude vers le plafond.', 'Suivez du regard.'] },
  'hamstring-stretch': { name: 'Étirement des ischio-jambiers', muscle: 'Souplesse arrière des cuisses', group: 'Mobilité & équilibre', equip: 'bw', home: true, cues: ['Jambe tendue sur un support bas.', 'Penchez-vous dos droit.', 'Tenez 30 secondes sans douleur.'] },
};

// Movement pattern for every exercise id (existing + extra)
export const PATTERN_OF = {
  bench: 'bench', 'incline-db': 'bench', 'incline-bench': 'bench', 'decline-bench': 'bench', 'db-bench': 'bench', 'close-bench': 'bench', 'floor-press': 'bench', 'chest-press': 'press-seated',
  'cable-fly': 'fly', 'db-fly': 'fly', 'pec-deck': 'fly', dips: 'dips', 'bench-dips': 'dips', pushup: 'pushup', 'incline-pushup': 'pushup', 'pike-pushup': 'pushup',
  ohp: 'ohp', 'barbell-ohp': 'ohp', arnold: 'ohp', 'machine-shoulder': 'ohp', lateral: 'lateral', 'front-raise': 'front-raise', 'upright-row': 'upright-row', 'face-pull': 'face-pull', 'reverse-fly': 'reverse-fly', shrug: 'shrug',
  'lat-pulldown': 'pulldown', 'close-pulldown': 'pulldown', pullup: 'pullup', 'chin-up': 'pullup', row: 'row', 'db-row': 'row', 't-bar-row': 'row', 'seated-row': 'seated-row', 'machine-row': 'seated-row', 'band-row': 'seated-row', 'inverted-row': 'row', pullover: 'pullover', 'back-ext': 'hinge', superman: 'superman',
  curl: 'curl', 'barbell-curl': 'curl', 'hammer-curl': 'curl', 'preacher-curl': 'curl', 'concentration-curl': 'curl', 'cable-curl': 'curl', triceps: 'pushdown', 'rope-pushdown': 'pushdown', 'overhead-ext': 'overhead', skullcrusher: 'skull', kickback: 'kickback',
  squat: 'squat', 'front-squat': 'squat', 'hack-squat': 'squat', 'smith-squat': 'squat', 'goblet-squat': 'squat', 'bw-squat': 'squat', 'sumo-squat': 'squat', 'wall-sit': 'wall-sit', 'jump-squat': 'squat',
  'leg-press': 'leg-press', 'leg-ext': 'leg-ext', lunge: 'lunge', 'reverse-lunge': 'lunge', 'split-squat': 'lunge', 'step-up': 'step-up', 'hip-opener': 'lunge',
  rdl: 'hinge', 'good-morning': 'hinge', deadlift: 'deadlift', 'sumo-deadlift': 'deadlift', 'single-rdl': 'hinge', 'leg-curl': 'leg-curl', 'seated-leg-curl': 'leg-curl',
  'hip-thrust': 'hip-thrust', 'glute-bridge': 'bridge', abduction: 'abduction', adduction: 'abduction', 'cable-kickback': 'donkey', 'donkey-kick': 'donkey',
  calf: 'calf', 'seated-calf': 'calf',
  plank: 'plank', 'side-plank': 'plank', 'dead-bug': 'crunch', 'leg-raise': 'leg-raise', 'hanging-raise': 'hanging-raise', 'bird-dog': 'bird-dog', crunch: 'crunch', 'cable-crunch': 'crunch', 'russian-twist': 'crunch', 'ab-wheel': 'plank', bicycle: 'crunch', 'farmer-walk': 'walk',
  mountain: 'run', 'brisk-walk': 'walk', jumping: 'run', treadmill: 'run', bike: 'bike', rower: 'rower', elliptical: 'walk', burpees: 'pushup', stairs: 'step-up',
  balance: 'balance', 'cat-cow': 'cat-cow', 'thoracic-rot': 'bird-dog', 'hamstring-stretch': 'hinge',
};

export const EQUIP_OF = {
  bench: 'bar', 'incline-db': 'db', 'cable-fly': 'cable', dips: 'bw', ohp: 'db', lateral: 'db', triceps: 'cable', 'lat-pulldown': 'cable', row: 'bar', 'seated-row': 'cable', curl: 'db',
  squat: 'bar', 'leg-press': 'machine', 'leg-ext': 'machine', lunge: 'db', rdl: 'bar', 'leg-curl': 'machine', 'hip-thrust': 'bar', abduction: 'machine', calf: 'machine', plank: 'bw', pushup: 'bw',
  'bw-squat': 'bw', 'glute-bridge': 'bw', 'split-squat': 'bw', superman: 'bw', mountain: 'bw', pullup: 'bw', 'face-pull': 'cable', 'reverse-fly': 'db', 'hammer-curl': 'db', 'overhead-ext': 'db',
  'chest-press': 'machine', 'floor-press': 'db', 'leg-raise': 'bw', 'dead-bug': 'bw', 'bird-dog': 'bw', 'step-up': 'bw', 'farmer-walk': 'db', 'wall-sit': 'bw', balance: 'bw', 'brisk-walk': 'cardio',
  'cat-cow': 'bw', 'hip-opener': 'bw', 'goblet-squat': 'db', jumping: 'cardio',
};

// ---- Poses -------------------------------------------------------------------
// Side view facing right. Joints: h head, s shoulder, e elbow, w wrist, p hip, k knee, a ankle, t toe,
// e2/w2 far arm, k2/a2/t2 far leg. Each pattern: [poseA, poseB, props, weight]
const ST = { h: [100, 28], s: [100, 45], e: [101, 67], w: [102, 89], p: [100, 90], k: [100, 118], a: [100, 147], t: [112, 148] };
const P = (o) => ({ ...ST, ...o });
const FLOOR = '<line x1="10" y1="150" x2="190" y2="150" class="mv-floor"/>';
const BENCH = (y = 118, x1 = 50, x2 = 150) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="7" rx="3" class="mv-prop"/><line x1="${x1 + 12}" y1="${y + 7}" x2="${x1 + 12}" y2="150" class="mv-prop-l"/><line x1="${x2 - 12}" y1="${y + 7}" x2="${x2 - 12}" y2="150" class="mv-prop-l"/>`;
const BAR_TOP = '<line x1="60" y1="2" x2="140" y2="2" class="mv-prop-l"/>';
const SEAT = (x = 88, y = 108) => `<rect x="${x}" y="${y}" width="30" height="6" rx="3" class="mv-prop"/><line x1="${x + 15}" y1="${y + 6}" x2="${x + 15}" y2="150" class="mv-prop-l"/>`;

export const POSES = {
  squat: [P({ e: [108, 60], w: [110, 48] }), P({ h: [114, 58], s: [108, 74], e: [114, 92], w: [118, 78], p: [84, 113], k: [113, 121] }), FLOOR, 'w'],
  'wall-sit': [P({ h: [74, 64], s: [74, 81], e: [86, 96], w: [96, 104], p: [74, 120], k: [102, 120] }), P({ h: [74, 62], s: [74, 80], e: [86, 95], w: [96, 103], p: [74, 120], k: [102, 120] }), `${FLOOR}<line x1="66" y1="20" x2="66" y2="150" class="mv-prop-l"/>`, ''],
  hinge: [P({}), P({ h: [134, 64], s: [122, 71], e: [121, 93], w: [120, 114], p: [82, 92], k: [98, 117] }), FLOOR, 'w'],
  deadlift: [P({}), P({ h: [130, 72], s: [118, 80], e: [117, 101], w: [116, 122], p: [80, 104], k: [106, 122] }), FLOOR, 'w'],
  lunge: [P({ k2: [100, 118], a2: [100, 147], t2: [112, 148] }), P({ h: [100, 44], s: [100, 61], e: [101, 83], w: [102, 104], p: [100, 106], k: [127, 118], a: [124, 147], t: [136, 148], k2: [88, 133], a2: [62, 141], t2: [58, 148] }), FLOOR, 'w'],
  'step-up': [P({ k: [118, 104], a: [120, 120], t: [132, 121] }), P({ h: [114, 8], s: [114, 25], e: [115, 47], w: [116, 68], p: [114, 70], k: [118, 96], a: [120, 120], t: [132, 121] }), `${FLOOR}<rect x="108" y="121" width="44" height="29" rx="3" class="mv-prop"/>`, ''],
  bench: [{ h: [150, 104], s: [135, 111], e: [136, 89], w: [136, 67], p: [88, 111], k: [62, 106], a: [42, 125], t: [44, 135] }, { h: [150, 104], s: [135, 111], e: [122, 124], w: [134, 104], p: [88, 111], k: [62, 106], a: [42, 125], t: [44, 135] }, `${FLOOR}${BENCH(118, 60, 160)}`, 'w'],
  skull: [{ h: [150, 104], s: [135, 111], e: [136, 89], w: [136, 67], p: [88, 111], k: [62, 106], a: [42, 125], t: [44, 135] }, { h: [150, 104], s: [135, 111], e: [138, 89], w: [154, 99], p: [88, 111], k: [62, 106], a: [42, 125], t: [44, 135] }, `${FLOOR}${BENCH(118, 60, 160)}`, 'w'],
  'press-seated': [P({ h: [92, 40], s: [92, 57], e: [104, 72], w: [116, 58], p: [92, 102], k: [120, 104], a: [120, 133], t: [132, 134] }), P({ h: [92, 40], s: [92, 57], e: [114, 58], w: [136, 57], p: [92, 102], k: [120, 104], a: [120, 133], t: [132, 134] }), `${FLOOR}${SEAT(76, 104)}<rect x="74" y="40" width="7" height="64" rx="3" class="mv-prop"/>`, 'w'],
  pushup: [{ h: [147, 105], s: [135, 112], e: [136, 130], w: [137, 146], p: [88, 128], k: [64, 137], a: [40, 145], t: [36, 149] }, { h: [151, 127], s: [138, 132], e: [120, 136], w: [137, 146], p: [89, 138], k: [64, 142], a: [40, 145], t: [36, 149] }, FLOOR, ''],
  dips: [P({ e: [98, 67], w: [97, 88], k: [92, 116], a: [74, 126], t: [70, 134] }), P({ h: [102, 46], s: [100, 63], e: [82, 74], w: [97, 88], p: [100, 108], k: [92, 134], a: [74, 142], t: [70, 150] }), '<line x1="80" y1="88" x2="130" y2="88" class="mv-prop-l"/>', ''],
  ohp: [P({ h: [100, 38], s: [100, 55], e: [112, 70], w: [112, 52] }), P({ h: [100, 38], s: [100, 55], e: [104, 34], w: [104, 12] }), FLOOR, 'w'],
  'front-raise': [P({}), P({ e: [122, 46], w: [143, 46] }), FLOOR, 'w'],
  lateral: [{ h: [100, 28], s: [88, 47], e: [84, 68], w: [82, 89], p: [100, 92], k: [94, 120], a: [94, 147], t: [90, 149], e2: [116, 68], w2: [118, 89], k2: [106, 120], a2: [106, 147], t2: [110, 149], s2: [112, 47] }, { h: [100, 28], s: [88, 47], e: [66, 46], w: [45, 47], p: [100, 92], k: [94, 120], a: [94, 147], t: [90, 149], e2: [134, 46], w2: [155, 47], k2: [106, 120], a2: [106, 147], t2: [110, 149], s2: [112, 47] }, FLOOR, 'w'],
  fly: [{ h: [100, 28], s: [88, 47], e: [66, 52], w: [48, 62], p: [100, 92], k: [94, 120], a: [94, 147], t: [90, 149], e2: [134, 52], w2: [152, 62], k2: [106, 120], a2: [106, 147], t2: [110, 149], s2: [112, 47] }, { h: [100, 28], s: [88, 47], e: [80, 66], w: [96, 72], p: [100, 92], k: [94, 120], a: [94, 147], t: [90, 149], e2: [120, 66], w2: [104, 72], k2: [106, 120], a2: [106, 147], t2: [110, 149], s2: [112, 47] }, FLOOR, 'w'],
  'reverse-fly': [P({ h: [134, 64], s: [122, 71], e: [123, 92], w: [124, 113], p: [82, 92], k: [98, 117] }), P({ h: [134, 64], s: [122, 71], e: [114, 52], w: [104, 36], p: [82, 92], k: [98, 117] }), FLOOR, 'w'],
  'face-pull': [P({ e: [121, 46], w: [143, 46] }), P({ e: [84, 40], w: [104, 30] }), `${FLOOR}<line x1="180" y1="46" x2="180" y2="150" class="mv-prop-l"/>`, 'cable:180,46'],
  'upright-row': [P({}), P({ e: [88, 42], w: [104, 54] }), FLOOR, 'w'],
  shrug: [P({}), P({ s: [100, 40], e: [101, 62], w: [102, 84], h: [100, 25] }), FLOOR, 'w'],
  pulldown: [P({ h: [95, 44], s: [96, 61], e: [100, 38], w: [102, 16], p: [100, 105], k: [126, 106], a: [126, 135], t: [138, 136] }), P({ h: [94, 44], s: [96, 61], e: [86, 78], w: [102, 66], p: [100, 105], k: [126, 106], a: [126, 135], t: [138, 136] }), `${FLOOR}${SEAT(86, 108)}<line x1="102" y1="-8" x2="102" y2="2" class="mv-prop-l"/>`, 'cable:102,-8'],
  pullup: [P({ h: [100, 26], s: [100, 42], e: [100, 22], w: [100, 2], p: [100, 87], k: [100, 115], a: [100, 143], t: [106, 146] }), P({ h: [104, 6], s: [100, 22], e: [84, 14], w: [100, 2], p: [100, 66], k: [100, 94], a: [100, 122], t: [106, 125] }), BAR_TOP, ''],
  row: [P({ h: [134, 64], s: [122, 71], e: [121, 93], w: [120, 114], p: [82, 92], k: [98, 117] }), P({ h: [134, 64], s: [122, 71], e: [101, 78], w: [108, 98], p: [82, 92], k: [98, 117] }), FLOOR, 'w'],
  'seated-row': [P({ h: [100, 44], s: [98, 61], e: [120, 70], w: [140, 74], p: [92, 106], k: [120, 98], a: [146, 112], t: [150, 104] }), P({ h: [96, 44], s: [94, 61], e: [76, 72], w: [98, 80], p: [92, 106], k: [120, 98], a: [146, 112], t: [150, 104] }), `${FLOOR}${SEAT(78, 110)}<line x1="174" y1="74" x2="174" y2="150" class="mv-prop-l"/>`, 'cable:174,74'],
  pullover: [P({ h: [108, 30], s: [104, 47], e: [124, 30], w: [140, 16] }), P({ h: [108, 30], s: [104, 47], e: [114, 68], w: [118, 89] }), `${FLOOR}<line x1="170" y1="-8" x2="170" y2="150" class="mv-prop-l"/>`, 'cable:170,-8'],
  superman: [{ h: [150, 136], s: [135, 140], e: [150, 144], w: [166, 144], p: [90, 142], k: [62, 143], a: [36, 144], t: [32, 148] }, { h: [152, 128], s: [136, 134], e: [154, 130], w: [172, 126], p: [90, 142], k: [62, 138], a: [36, 132], t: [30, 134] }, FLOOR, ''],
  curl: [P({}), P({ w: [114, 51] }), FLOOR, 'w'],
  pushdown: [P({ e: [104, 68], w: [120, 58] }), P({ e: [104, 68], w: [108, 90] }), `${FLOOR}<line x1="140" y1="-8" x2="140" y2="150" class="mv-prop-l"/>`, 'cable:140,-8'],
  overhead: [P({ e: [106, 24], w: [90, 34] }), P({ e: [106, 24], w: [108, 2] }), FLOOR, 'w'],
  kickback: [P({ h: [134, 64], s: [122, 71], e: [102, 80], w: [112, 99], p: [82, 92], k: [98, 117] }), P({ h: [134, 64], s: [122, 71], e: [102, 80], w: [82, 86], p: [82, 92], k: [98, 117] }), FLOOR, 'w'],
  'leg-press': [{ h: [52, 72], s: [62, 86], e: [76, 100], w: [86, 110], p: [96, 120], k: [104, 88], a: [134, 82], t: [136, 70] }, { h: [52, 72], s: [62, 86], e: [76, 100], w: [86, 110], p: [96, 120], k: [124, 106], a: [152, 96], t: [154, 84] }, `${FLOOR}<line x1="48" y1="80" x2="96" y2="128" class="mv-prop-l"/>`, ''],
  'leg-ext': [P({ h: [89, 45], s: [90, 62], e: [95, 84], w: [104, 100], p: [95, 105], k: [122, 105], a: [124, 134], t: [136, 136] }), P({ h: [89, 45], s: [90, 62], e: [95, 84], w: [104, 100], p: [95, 105], k: [122, 105], a: [150, 100], t: [154, 88] }), `${FLOOR}${SEAT(80, 108)}`, ''],
  'leg-curl': [{ h: [150, 104], s: [135, 111], e: [140, 120], w: [150, 120], p: [90, 111], k: [62, 111], a: [34, 111], t: [30, 104] }, { h: [150, 104], s: [135, 111], e: [140, 120], w: [150, 120], p: [90, 111], k: [62, 111], a: [70, 83], t: [64, 78] }, `${FLOOR}${BENCH(118, 50, 160)}`, ''],
  'hip-thrust': [{ h: [52, 90], s: [62, 100], e: [74, 112], w: [88, 124], p: [88, 130], k: [114, 118], a: [125, 147], t: [137, 148] }, { h: [52, 90], s: [62, 100], e: [76, 100], w: [94, 98], p: [95, 100], k: [122, 118], a: [125, 147], t: [137, 148] }, `${FLOOR}<rect x="30" y="102" width="40" height="7" rx="3" class="mv-prop"/><line x1="50" y1="109" x2="50" y2="150" class="mv-prop-l"/>`, 'p'],
  bridge: [{ h: [44, 143], s: [60, 144], e: [72, 148], w: [86, 148], p: [90, 144], k: [114, 122], a: [125, 147], t: [137, 148] }, { h: [44, 143], s: [60, 142], e: [72, 148], w: [86, 148], p: [94, 118], k: [120, 116], a: [125, 147], t: [137, 148] }, FLOOR, ''],
  abduction: [{ h: [100, 40], s: [100, 57], e: [86, 78], w: [84, 98], e2: [114, 78], w2: [116, 98], s2: [100, 57], p: [94, 104], k: [92, 108], a: [90, 138], t: [86, 140], k2: [108, 108], a2: [110, 138], t2: [114, 140] }, { h: [100, 40], s: [100, 57], e: [86, 78], w: [84, 98], e2: [114, 78], w2: [116, 98], s2: [100, 57], p: [94, 104], k: [74, 112], a: [72, 140], t: [68, 142], k2: [126, 112], a2: [128, 140], t2: [132, 142] }, `${FLOOR}${SEAT(84, 108)}`, ''],
  donkey: [{ h: [140, 82], s: [128, 92], e: [129, 114], w: [130, 136], p: [84, 94], k: [84, 136], a: [60, 138], t: [56, 146] }, { h: [140, 82], s: [128, 92], e: [129, 114], w: [130, 136], p: [84, 94], k: [62, 86], a: [60, 58], t: [52, 56] }, FLOOR, ''],
  calf: [P({}), P({ h: [100, 20], s: [100, 37], e: [101, 59], w: [102, 81], p: [100, 82], k: [100, 110], a: [102, 139], t: [112, 148] }), `${FLOOR}`, ''],
  plank: [{ h: [146, 110], s: [132, 118], e: [132, 140], w: [152, 141], p: [88, 130], k: [64, 138], a: [40, 145], t: [36, 149] }, { h: [146, 109], s: [132, 117], e: [132, 140], w: [152, 141], p: [88, 127], k: [64, 136], a: [40, 145], t: [36, 149] }, FLOOR, ''],
  crunch: [{ h: [142, 138], s: [128, 142], e: [140, 132], w: [146, 128], p: [90, 142], k: [70, 118], a: [52, 146], t: [48, 140] }, { h: [130, 114], s: [120, 128], e: [132, 118], w: [136, 110], p: [90, 142], k: [70, 118], a: [52, 146], t: [48, 140] }, FLOOR, ''],
  'leg-raise': [{ h: [150, 140], s: [136, 143], e: [118, 146], w: [104, 146], p: [90, 143], k: [62, 143], a: [34, 143], t: [30, 136] }, { h: [150, 140], s: [136, 143], e: [118, 146], w: [104, 146], p: [90, 143], k: [88, 115], a: [86, 87], t: [80, 82] }, FLOOR, ''],
  'hanging-raise': [P({ h: [100, 26], s: [100, 42], e: [100, 22], w: [100, 2], p: [100, 87], k: [100, 115], a: [100, 143], t: [106, 146] }), P({ h: [100, 26], s: [100, 42], e: [100, 22], w: [100, 2], p: [100, 87], k: [126, 84], a: [152, 84], t: [154, 76] }), BAR_TOP, ''],
  'bird-dog': [{ h: [140, 82], s: [128, 92], e: [129, 114], w: [130, 136], p: [84, 94], k: [84, 136], a: [60, 138], t: [56, 146] }, { h: [140, 82], s: [128, 92], e: [148, 86], w: [170, 82], p: [84, 94], k: [58, 94], a: [32, 92], t: [28, 98] }, FLOOR, ''],
  'cat-cow': [{ h: [142, 92], s: [128, 92], e: [129, 114], w: [130, 136], p: [84, 94], k: [84, 136], a: [60, 138], t: [56, 146], m: [106, 82] }, { h: [142, 84], s: [128, 92], e: [129, 114], w: [130, 136], p: [84, 94], k: [84, 136], a: [60, 138], t: [56, 146], m: [106, 102] }, FLOOR, ''],
  balance: [P({ k2: [100, 118], a2: [100, 147], t2: [112, 148] }), P({ e: [116, 72], w: [130, 80], k2: [114, 112], a2: [104, 136], t2: [114, 138] }), FLOOR, ''],
  walk: [P({ k: [108, 118], a: [112, 147], t: [124, 148], k2: [94, 118], a2: [84, 145], t2: [94, 149], e: [96, 66], w: [92, 88], e2: [106, 66], w2: [112, 86] }), P({ k: [94, 118], a: [84, 145], t: [94, 149], k2: [108, 118], a2: [112, 147], t2: [124, 148], e: [106, 66], w: [112, 86], e2: [96, 66], w2: [92, 88] }), FLOOR, ''],
  run: [P({ h: [104, 28], s: [103, 45], p: [100, 88], k: [120, 106], a: [116, 132], t: [128, 134], k2: [90, 114], a2: [70, 124], t2: [66, 132], e: [92, 62], w: [100, 76], e2: [114, 58], w2: [124, 48] }), P({ h: [104, 28], s: [103, 45], p: [100, 88], k: [90, 114], a: [70, 124], t: [66, 132], k2: [120, 106], a2: [116, 132], t2: [128, 134], e: [114, 58], w: [124, 48], e2: [92, 62], w2: [100, 76] }), FLOOR, ''],
  bike: [P({ h: [116, 40], s: [110, 56], e: [128, 70], w: [146, 74], p: [88, 92], k: [114, 88], a: [110, 116], t: [120, 118], k2: [110, 108], a2: [108, 136], t2: [118, 138] }), P({ h: [116, 40], s: [110, 56], e: [128, 70], w: [146, 74], p: [88, 92], k: [110, 108], a: [108, 136], t: [118, 138], k2: [114, 88], a2: [110, 116], t2: [120, 118] }), `${FLOOR}${SEAT(74, 96)}<circle cx="109" cy="126" r="12" class="mv-prop-c"/><line x1="146" y1="74" x2="140" y2="150" class="mv-prop-l"/>`, ''],
  rower: [{ h: [118, 72], s: [108, 86], e: [130, 98], w: [150, 104], p: [86, 128], k: [112, 104], a: [130, 134], t: [138, 128] }, { h: [86, 76], s: [92, 90], e: [104, 110], w: [118, 104], p: [110, 128], k: [138, 124], a: [164, 132], t: [170, 124] }, `${FLOOR}<line x1="40" y1="134" x2="176" y2="134" class="mv-prop-l"/>`, ''],
};

const LINES = [['p', 's'], ['s', 'e', 'w'], ['p', 'k', 'a', 't']];

function pts(pose, keys) { return keys.map((k) => (pose[k] || pose.s).join(',')).join(' '); }
function torsoKeys(pose) { return pose.s2 ? ['p', 's', 's2', 'p'] : pose.m ? ['p', 'm', 's'] : ['p', 's']; }

export function moveSvg(id, opts = {}) {
  const pattern = PATTERN_OF[id] || 'walk';
  const [A, B, props, weight] = POSES[pattern] || POSES.walk;
  const dur = opts.dur || (['plank', 'wall-sit', 'balance'].includes(pattern) ? 3.2 : ['run', 'bike'].includes(pattern) ? 0.9 : 2.4);
  const anim = (attr, a, b) => `<animate attributeName="${attr}" values="${a};${b};${a}" keyTimes="0;0.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" dur="${dur}s" repeatCount="indefinite"/>`;
  const poly = (keys, cls) => `<polyline class="${cls}" points="${pts(A, keys)}">${anim('points', pts(A, keys), pts(B, keys))}</polyline>`;
  let far = '';
  if (A.e2) far += poly([A.s2 ? 's2' : 's', 'e2', 'w2'], 'mv-far');
  if (A.k2) far += poly(['p', 'k2', 'a2', 't2'], 'mv-far');
  const near = poly(torsoKeys(A), 'mv-body') + poly(['s', 'e', 'w'], 'mv-body') + poly(['p', 'k', 'a', 't'], 'mv-body');
  const head = `<circle class="mv-head" r="9" cx="${A.h[0]}" cy="${A.h[1]}">${anim('cx', A.h[0], B.h[0])}${anim('cy', A.h[1], B.h[1])}</circle>`;
  let extra = '';
  const equip = opts.equip || EQUIP_OF[id] || 'bw';
  if (weight && weight.startsWith('cable:')) {
    const [cx, cy] = weight.slice(6).split(',').map(Number);
    extra += `<line class="mv-cable" x1="${cx}" y1="${cy}" x2="${A.w[0]}" y2="${A.w[1]}">${anim('x2', A.w[0], B.w[0])}${anim('y2', A.w[1], B.w[1])}</line>`;
  } else if (weight && equip !== 'bw' && equip !== 'cardio') {
    const key = weight;
    const r = equip === 'bar' ? 8 : 5;
    const mk = (k) => (A[k] ? `<circle class="mv-weight ${equip}" r="${r}" cx="${A[k][0]}" cy="${A[k][1]}">${anim('cx', A[k][0], B[k][0])}${anim('cy', A[k][1], B[k][1])}</circle>` : '');
    extra += mk(key);
    if (key === 'w' && A.w2) extra += mk('w2');
  }
  return `<svg class="move-svg" viewBox="14 -12 172 168" role="img" aria-hidden="true">${props}${far}${near}${head}${extra}</svg>`;
}
