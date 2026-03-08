const STAGE_PROGRESS_MAP = {
  Foundation: 10,
  'Super Structure': 40,
  Facade: 65,
  Interior: 85,
  Completed: 100,
};

const STAGES = Object.keys(STAGE_PROGRESS_MAP);

module.exports = {
  STAGES,
  STAGE_PROGRESS_MAP,
};
