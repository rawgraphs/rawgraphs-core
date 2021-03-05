module.exports = {
  //docs: ['core', 'concepts', 'start', 'charts', 'api'],

  docs : [
      'core',
      { type: 'category', label: 'Concepts', items: ['workflow', 'glossary']},
      { type: 'category', label: 'Getting started', items: ['install', 'example-npm', 'example-script']},
      'rendering',
      { type: 'category', label: 'Implementing charts', items: ['chart-interface', 'chart-utilities',  'declarative-mapping',]},
      { type: 'category', label: 'Utility functions', items: ['data-parsing', 'import-export']},
      'api',

    ]
    // 'Introduction' : ['core'],
    // 'Concepts': ['workflow', 'glossary'],
    // 'Gettings started': {type: 'śoc', id: 'start'},
    // 'Rendering charts': ['start'],
    // 'Making new charts': ['start'],
    // 'Utility functions': ['start'],
    // 'concepts' : { label: 'Concepts',  ids: ['concepts']},
    // 'getting-started' : { label: 'Getting started',  ids: ['start']},
    // 'rendering' : { label: 'Rendering charts',  ids: ['start']},
    // 'charts' : { label: 'Making new charts',  ids: ['start']},
    // 'utils' : { label: 'Utility functions',  ids: ['start']},
  
}
