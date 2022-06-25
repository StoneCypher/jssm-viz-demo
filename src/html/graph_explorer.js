
const ExampleMachines = [{
  machine_name: "Sequential Function Chart",
  url: "https://raw.githubusercontent.com/StoneCypher/jssm/main/src/machines/sequential_function_chart.fsl",
  fsl: `
    machine_name     : "Sequential Function Chart";
    machine_author   : "MachinShin <machinshin@gmail.com>";
    machine_license  : MIT;
    machine_comment  : "#madewithfsl";
    machine_language : en;
    machine_version  : 1.0.0;
    fsl_version      : 1.0.0;

    start_states     : ["Start Batch"];
    end_states       : ["End Batch"];

    "Start Batch" => "Check Reactor";

    "Check Reactor" 'Empty'
      -> "Charge A (2000 lbs)";
    "Check Reactor" 'Not Empty'
      => "Drain Reactor" 'Drain Reactor Complete' -> "Check Reactor";
    "Charge A (2000 lbs)" 'Charge A complete'
      -> "Charge B (5000 lbs)";

    "Charge B (5000 lbs)" 'Charge B1 complete'
      => "Temp Control (100deg C)";
    "Charge B (5000 lbs" 'Charge B2 complete'
      => "Pressure Control (5 psig)";

    "Temp Control (100deg C)" 'At temperature'
      => "Wait (120 minutes)";
    "Pressure Control (5 psig)" 'At pressure'
      => "Wait (120 minutes)";

    "Wait (120 minutes)" -> "Sample";

    "Sample" 'Good'
      => "Discharge";
    "Sample" 'Bad'
      -> "Wait (120 minutes)";

    "Discharge" 'Complete'
      => "End Batch";

    state "Start Batch": {
      shape: rectangle;
      corners: rounded;
      background-color: limegreen;
      text-color: white;
      linestyle: dashed;
    };
    state "End Batch": {
      shape: rectangle;
      corners: rounded;
      background-color: skyblue;
      text-color: black;
      linestyle: dashed;
    };`
  },
  {
    machine_name: "Unit Chains",
    url: "https://github.com/StoneCypher/jssm/raw/main/src/machines/unit_chains.fsl",
    fsl: `
    machine_name     : "Unit Chains";
    machine_author   : "MachinShin <machinshin@gmail.com>";
    machine_license  : MIT;
    machine_comment  : "#madewithfsl";
    machine_language : en;
    machine_version  : 1.0.0;
    fsl_version      : 1.0.0;
    flow: down;

    start_states: [ twip ];
    end_states: [ league spindle mile "Roman mile" finger ];

    arrange [ digit finger inch stick ];
    arrange [ span link shaftment foot hand ];
    arrange [ "Ramsden's chain" "Gunter's chain" shackle ];
    arrange [ skein furlong cable ];
    arrange [ "Roman mile" mile "nautic mile" ];
    arrange [ spindle league ];

    link '25' -> "rod, pole, perch";
    twip '20' -> point;

    point '12' -> pica;
    point '6' -> line '1' -> poppyseed '4' -> barleycorn '3' -> inch '2'
      -> stick '2' -> hand;
    point '63' -> finger;
    pica '6' -> inch;
    inch '7/8' -> finger;
    inch '12' -> foot;
    hand '3' -> foot;
    line '12' -> inch;
    inch '3' -> palm;
    digit '3' -> nail '4' -> span '5' -> ell '96' -> skein '120' -> spindle;
    digit '4' -> palm '3' -> span;
    span '2' -> cubit;
    palm '2' -> shaftment '3' -> cubit;
    shaftment '2' -> foot;
    shaftment '5' -> pace '2' -> "grade, step" '4' -> rope '5'
      -> "Ramsden's chain" '50' -> "Roman mile";

    cubit '2' -> yard '1760' -> mile;
    cubit '11' -> "rod, pole, perch" '4' -> "Gunter's chain" '10'
      -> furlong '8' -> mile;
    yard '2' -> fathom '11' -> "Gunter's chain";
    fathom '100' -> cable '10' -> "nautic mile";
    fathom '15' -> shackle;
    foot '6080' -> "nautic mile";
    "nautic mile" '3' -> league;`
  },
  {
    machine_name: "TCP/IP 1.0",
    url: "https://raw.githubusercontent.com/StoneCypher/jssm/main/src/machines/linguist/tcp%20ip.fsl",
    fsl: `
      machine_name      : "TCP/IP";
      machine_reference : "http://www.texample.net/tikz/examples/tcp-state-machine/";
      machine_version   : 1.0.0;

      machine_author    : "John Haugeland <stonecypher@gmail.com>";
      machine_license   : MIT;

      jssm_version      : >= 5.0.0;
      graph_layout      : dot;



      Closed 'Passive open'      -> Listen;
      Closed 'Active Open / SYN' -> SynSent;

      Listen 'Close'         -> Closed;
      Listen 'Send / SYN'    -> SynSent;
      Listen 'SYN / SYN+ACK' -> SynRcvd;

      SynSent 'Close'         -> Closed;
      SynSent 'SYN / SYN+ACK' -> SynRcvd;
      SynSent 'SYN+ACK / ACK' -> Established;

      SynRcvd 'Timeout / RST' -> Closed;
      SynRcvd 'Close / FIN'   -> FinWait1;
      SynRcvd 'ACK'           -> Established;

      Established 'Close / FIN' -> FinWait1;
      Established 'FIN / ACK'   -> CloseWait;

      FinWait1 'FIN / ACK'     -> Closing;  // the source diagram has this action wrong
      FinWait1 'FIN+ACK / ACK' -> TimeWait;
      FinWait1 'ACK / Nothing' -> FinWait2; // this too, see http://www.cs.odu.edu/~cs779/spring17/lectures/architecture_files/image009.jpg

      FinWait2 'FIN / ACK' -> TimeWait;

      Closing 'ACK' -> TimeWait;

      TimeWait 'Up to 2*MSL' -> Closed;

      CloseWait 'Close / FIN' -> LastAck;

      LastAck 'ACK' -> Closed;`
  }
]

document.onchange = function () {
  const byId       = z => document.getElementById(z);
  const editor = byId('editor'),
    fslFileUrl = byId('select_machine');

  console.log(`fslFileURL :: ${JSON.stringify(fslFileUrl, null, 2)}`);
}

window.onload = () => {

  const PrevTheme = localStorage.getItem('PrevTheme') || 'solarized_dark',
    PrevRot   = localStorage.getItem('PrevRot')   || 'edRight';



  const RRange = ace.require('ace/range').Range;

  const jviz       = jssm_viz,  // iife puts it directly in namespace
    jssm       = jviz.jssm,
    sm         = jssm.sm,
    byId       = z => document.getElementById(z);

  const svg_t      = byId('svg_target'),
    editor     = byId('editor'),
    errorX     = byId('errorX'),
    example    = byId('example_machine'),
    viewLink   = byId('viewLink'),
    editorLink = byId('editorLink'),
    textUp     = byId('textUp'),
    textDown   = byId('textDown'),
    addHeader  = byId('addHeader'),
    rotEditor  = byId('rotateEditor'),
    zoom       = byId('zoom'),
    theme      = byId('theme'),
    showHelp   = byId('showHelp'),
    vis_btn    = byId('vis_btn'),
    tree_btn   = byId('tree_btn'),
    svg_btn    = byId('svg_btn'),
    dot_btn    = byId('dot_btn');

  const viewerUrl  = 'https://fsl.tools/viewer/?z=';

  const minSz  = 3;
  let   edSize = 21;

  let   view   = 'vis',
    curSM  = null;



  const setCodeError = e => {

    if (e.location) {

      const start_r = `${e.location.start.line}:${e.location.start.column}`,
        end_r   = `${e.location.end.line}:${e.location.end.column}`;

      errorX.innerHTML = (start_r === end_r) ? `${e.message} (${start_r})`
        : `${e.message} (${start_r}&rarr;${end_r})`;

      ace_editor.getSession().setAnnotations([{
        row: e.location.start.line-1,
        column: e.location.start.column-1,
        text: e.message,
        type: "error"
      }]);

      // markerId = ace_editor.getSession().addMarker(
      //   new Range(e.location.start.line-1, e.location.start.column-1, e.location.end.line-1, e.location.end.column-1),
      //   "error",
      //   e.message
      // );

      const r1 = e.location.start.line-1,
        c1 = e.location.start.column-1,
        r2 = e.location.end.line-1,
        c2 = e.location.end.column-1;

      markers.push(
        ace_editor.session.addMarker(
          new RRange(r1, ((r2 === r1) && (c2 === c1))? c1-1 : c1, r2, c2),
          "errorRange",
          "text"
        )
      );

    } else {

      errorX.innerHTML = e.message;

    }

    document.body.classList.toggle('showError', true);

  }



  const updateEditor = () => {
    editor.style.fontSize = `${edSize}px`;
  };



  const bumpTsUp = () => {
    edSize += 1;
    updateEditor();
  };



  const bumpTsDown = () => {
    edSize = Math.max(edSize - 1, minSz);
    updateEditor();
  };



  const toggleHelp = () =>
    byId('editor_target').classList.toggle('showHelp');



  const toggleHelpTopicBox = evt =>
    evt.target.parentNode.classList.toggle('folded');



  let markers = [];

  const updateVisual = async (fsl_source) => {

    try {

      markers.map(id => ace_editor.session.removeMarker(id));

      curSM = sm`${fsl_source}`;

      const u_dot  = await jviz.fsl_to_dot(fsl_source, { engine: curSM.graph_layout() || 'dot' }),
        u_svg  = await jviz.fsl_to_svg_string(fsl_source, { engine: curSM.graph_layout() || 'dot' }),
        u_tree = JSON.stringify(jssm.parse(fsl_source), undefined, 2);
      const compressed = LZString.compressToEncodedURIComponent(fsl_source);
      viewLink.href    = viewerUrl + compressed;
      editorLink.href  = "?s="+ compressed;

      svg_t.innerHTML  = u_svg;

      tree_display ? tree_display.setValue(u_tree, 1) : true;
      dot_display  ? dot_display.setValue( u_dot,  1) : true;
      svg_display  ? svg_display.setValue( u_svg,  1) : true;

    } catch (e) {
      setCodeError(e);
    }

  };



  const maybe_s = (count, label) =>
    `${count} ${label}${count == 1? '' : 's'}`;



  const getStatusReadout = () => {

    const cpos      = ace_editor.selection.getCursor(),
      lines     = ace_editor.session.getLength(),
      nodecount = curSM? maybe_s(curSM._states.size, 'state')       : 'no',
      edgecount = curSM? maybe_s(curSM._edges.length, 'transition') : 'no',
      evtcount  = curSM? maybe_s(curSM._actions.size, 'action')     : 'no';

    return `Line ${cpos.row+1} col ${cpos.column+1} out of ${lines} lines &nbsp; &nbsp; ${nodecount}; ${edgecount}; ${evtcount}`;

  };



  const addFslHeader = () => {

    ace_editor.setValue(`
machine_name     : "A machine name";
machine_author   : "Shelby Everyperson <user@example.com>";
machine_license  : MIT;
machine_comment  : "Just a quick example of how these are written";
machine_language : en;
machine_version  : 1.0.0;
fsl_version      : 1.0.0;

start_states     : [Load Reset];
end_states       : [];

${ace_editor.getValue()}`.trim());

  };



  let was      = '',
    markerId = null;

  const updateCode = () => {

    try {

      const val = ace_editor.getValue();
      if (val === was) { return; }

      const newConfig = val;

      errorX.innerHTML = getStatusReadout();
      document.body.classList.toggle('showError', false);

      updateVisual(newConfig);

      ace_editor.getSession().setAnnotations([]);

      // if (markerId) { ace_editor.getSession().removeMarker(markerId); }

    } catch (e) {
      setCodeError(e);
    }

    was = editor.value;
    updateEditor();

  }



  const setZoom = () => {

    const newZoom = Math.max(1, byId('zoom').value);

    byId('svg_target').style.width  = `${newZoom}%`;
    byId('svg_target').style.height = `${newZoom}%`;

  };



  const setThemeTo = what => {
    ace_editor.setTheme(`ace/theme/${what}`);
    localStorage.setItem('PrevTheme', what);
  }

  const setTheme = () =>
    setThemeTo( byId('theme').value );


  // const

  const rotateEditor = () => {

    const newRot = {
      'edRight'  : 'edBottom',
      'edBottom' : 'edLeft',
      'edLeft'   : 'edTop',
      'edTop'    : 'edOnly',
      'edOnly'   : 'edOff',
      'edOff'    : 'edRight'
    }[document.body.className] || 'edRight';

    document.body.className = newRot;
    localStorage.setItem('PrevRot', newRot)

  };



  textDown.onclick  = bumpTsDown;
  textUp.onclick    = bumpTsUp;
  zoom.oninput      = setZoom;
  theme.onchange    = setTheme;
  addHeader.onclick = addFslHeader;
  rotEditor.onclick = rotateEditor;
  showHelp.onclick  = toggleHelp;

  vis_btn.onclick  = () => byId('topbox').className = 'show_svg';
  tree_btn.onclick = () => byId('topbox').className = 'show_tree';
  svg_btn.onclick  = () => byId('topbox').className = 'show_svg_code';
  dot_btn.onclick  = () => byId('topbox').className = 'show_dot_code';

  [... document.querySelectorAll('#editorHelp .topicBox h1')].map(h1 => {
    h1.onclick = toggleHelpTopicBox;
    h1.parentNode.classList.add('folded');
  });



  const l_config = `

machine_name: "Traffic light";

flow: down;



arrange [Green Yellow];

Off 'Enable' -> Red;
  Red 'Next' => Green 'Next' => Yellow 'Next' => Red;

[Red Yellow Green] ~> Off;



// visual styling

state Red    : { background-color: pink;        corners: rounded; };
state Yellow : { background-color: lightyellow; corners: rounded; };
state Green  : { background-color: lightgreen;  corners: rounded; };

state Off : {
  background-color : steelblue;
  text-color       : white;
  shape            : octagon;
  linestyle        : dashed;
};

  `.trim();

  const loadMachineConfig = defaultConfig =>{
    const urlArg                = new URLSearchParams(window.location.search);
    const compressed            = urlArg.get('s');
    const sharedMachineConfig   = compressed ? LZString.decompressFromEncodedURIComponent(compressed) : null;
    const machineConfig         = sharedMachineConfig || defaultConfig;
    return machineConfig;
  }

  editor.innerHTML = loadMachineConfig(l_config);
  editor.onkeyup   = () => updateCode();

  ace.require("ace/ext/language_tools");

  var ace_editor = ace.edit("editor");
  setTheme();
  ace_editor.session.setMode("ace/mode/fsl");

  updateVisual(loadMachineConfig(l_config));
  updateCode();
  byId('vis_btn').click();
  ace_editor.session.setTabSize(2);
  //        ace_editor.session.useSoftTabs(true);
  ace_editor.setOptions({ enableLiveAutocompletion: true });
  ace_editor.selection.on('changeCursor', () => errorX.innerHTML = getStatusReadout() );
  //        ace_editor.renderer.setTabSize(2);
  ace_editor.focus();
  ace_editor.navigateFileEnd();

  window.ae = ace_editor;
  window.cm = curSM;
  // word wrap

  var tree_display = ace.edit("tree");
  tree_display.session.setMode("ace/mode/javascript");
  tree_display.getSession().setUseWrapMode(true)
  tree_display.setReadOnly(true);

  var svg_display = ace.edit("svg_code");
  svg_display.session.setMode("ace/mode/svg");
  svg_display.getSession().setUseWrapMode(true)
  svg_display.setReadOnly(true);

  var dot_display = ace.edit("dot_code");
  dot_display.session.setMode("ace/mode/dot");
  dot_display.getSession().setUseWrapMode(true)
  dot_display.setReadOnly(true);

  ace_editor.commands.bindKeys({
    'ctrl-r'    : null,
    'ctrl-t'    : null,
    'ctrl-l'    : null,
    'command-r' : null,
    'command-t' : null,
    'command-l' : null
  });

  svg_display.commands.bindKeys({
    'ctrl-r'    : null,
    'ctrl-t'    : null,
    'ctrl-l'    : null,
    'command-r' : null,
    'command-t' : null,
    'command-l' : null
  });

  dot_display.commands.bindKeys({
    'ctrl-r'    : null,
    'ctrl-t'    : null,
    'ctrl-l'    : null,
    'command-r' : null,
    'command-t' : null,
    'command-l' : null
  });


  document.body.className = PrevRot;
  setThemeTo(PrevTheme);

  for (let idx=0; idx<theme.options.length; ++idx) {
    if (theme.options[idx].text === PrevTheme) {
      theme.options[idx].selected = true;
    }
  }

}
