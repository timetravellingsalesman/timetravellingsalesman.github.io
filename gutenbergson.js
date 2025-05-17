var mk_seq_rel = rel => (...xs) => {
    for(var i = 1; i < xs.length; ++i) {
	if(!rel(xs[i-1], xs[i])) return false;
    }
    return true;
};


var boolean$Qu = x => typeof(x) == 'boolean';

var eqv$Qu = mk_seq_rel(
    (a, b) =>
    (null$Qu(a) && null$Qu(b))
	|| (symbol$Qu(a) && symbol$Qu(b)
	    && a.symbol == b.symbol)
	|| (boolean$Qu(a) && boolean$Qu(b) && a == b)
	|| (number$Qu(a) && number$Qu(b) && a == b)
	|| a === b
);

var eq$Qu = eqv$Qu;

var $Eq = eq$Qu;

var $Pl = (...xs) => xs.reduce((n,m) => n+m, 0);

var $Mn = (...xs) => xs.length>1 ? xs.reduce((n,m) => n-m) : -xs[0];

var $St = (...xs) => xs.reduce((n,m) => n*m, 1);

var $Sl = (...xs) => xs.length>1 ? xs.reduce((n,m) => n/m) : 1/xs[0];

var not = x => !x;

var $Gt = mk_seq_rel((n,m) => n > m);

var $Ls = mk_seq_rel((n,m) => n < m);

var $Gt$Eq = mk_seq_rel((n,m) => n >= m);

var $Ls$Eq = mk_seq_rel((n,m) => n <= m);

var apply = (f, ...args) => {
    var collected = args.slice(0, args.length-1)
        .concat(args[args.length-1]);
    return f.apply(null, collected);
};

var procedure$Qu = x => typeof(x) == 'function';

var slot$Mnref = (x, prop) => symbol$Qu(prop)
    ? x[symbol$Mn$Gtstring(prop)]
    : x[prop];

var slot$Mnset$Ex = (x, prop, v) => {
    if (symbol$Qu(prop)) {
	x[symbol$Mn$Gtstring(prop)] = v;
    } else {
	x[prop] = v;
    }
};

var with$Mnslot$Qu = (x, name) => symbol$Qu(name)
    ? (symbol$Mn$Gtstring(name) in x)
    : (name in x);
var improper$Qu = x => typeof(x) == 'object'
    && typeof(x.improper) != 'undefined'
    && Array.isArray(x.improper)
    && x.improper.length>0
    && typeof(x.tail) != 'undefined';

var pair$Qu = x => typeof(x) == 'object'
    && ((Array.isArray(x) && x.length>0)
	|| (typeof(x.car) != 'undefined'
	    && typeof(x.cdr) != 'undefined')
	|| improper$Qu(x));

var cons = (h,t) => Array.isArray(t)
    ? [h].concat(t)
    : (improper$Qu(t)
       ? {improper: [h].concat(t.improper), tail: t.tail}
       : {car: h, cdr: t});

var car = p => Array.isArray(p)
    ? p[0]
    : (improper$Qu(p)
       ? p.improper[0]
       : p.car);

var cdr = p => Array.isArray(p)
    ? p.slice(1)
    : (improper$Qu(p)
       ? (p.improper.length > 0
	  ? {improper: p.improper.slice(1), tail: p.tail}
	  : p.tail)
       : p.cdr);

var null$Qu = x => Array.isArray(x) && !x.length;

var append = (...xs) => xs.length == 0
    ? []
    : xs[0].concat(...xs.slice(1));

var append$Ex = (...xs) => {
    if (xs.length == 0) {
	return xs;
    }
    for (var x of xs.slice(1)) {
	xs[0].push(...x);
    }
    return xs[0];
}

var list = (...xs) => xs;

var list$Mnref = (l, n) => l[n];

var length = l => l.length;

var for$Mneach = (f, l) => { for (var x of l) { f(x); } };

var map = (f, ...ls) => {
    switch (ls.length) {
    case 0: return [];
    case 1: return ls[0].map(f);
    default: break;
    }
    var result = [];
    for (var i = 0; i < ls[0].length; ++i) {
	var args = [];
	for (var arglist of ls) {
	    if (arglist.length < i) {
		return result;
	    }
	    args.push(arglist[i]);
	}
	result.push(f.apply(null, args));
    }
    return result;
};
var char$Qu = x => typeof(x) == 'object'
    && typeof(x.char) == 'string'
    && x.char.length == 1;

var string$Qu = x => typeof(x) == 'string';

var symbol$Qu = x => typeof(x) == 'object'
    && typeof(x.symbol) == 'string';

const __EOF = {char: false};

var eof$Mnobject$Qu = x => x === __EOF;

var symbol$Mn$Gtstring = s => s.symbol.replace(/^[$]N([0-9])/, "$1")
    .replace(/[$]Pl/g, "+")
    .replace(/[$]Mn/g, "-")
    .replace(/[$]St/g, "*")
    .replace(/[$]Sl/g, "/")
    .replace(/[$]Ls/g, "<")
    .replace(/[$]Gt/g, ">")
    .replace(/[$]Eq/g, "=")
    .replace(/[$]Ex/g, "!")
    .replace(/[$]Pc/g, "%")
    .replace(/[$]Qu/g, "?")
    .replace(/[$]At/g, "@")
    .replace(/[$]Tl/g, "~")
    .replace(/[$]Nm/g, "#");

var list$Mn$Gtstring = s => s.map(c => c.char).join('');

var string$Mn$Gtlist = s => s.split('').map(c =>{return {char: c}});

var string$Mnappend = (...args) => args.join('');

var string$Mnjoin = (strings, joint='') => strings.join(joint);

var string$Mnsplit = (string, separator) => string.split(separator);

let charName = c => {
    let i = c.char.codePointAt(0);
    if (i < 16) {
	return "x0"+i.toString(16);
    }
    if (i <= 32) {
	return "x"+i.toString(16);
    }
    return c.char;
};

var string$Mnref = (s, i) => { return {char: s[i]}; };

var string$Mnlength = s => s.length;

var char$Mn$Gtinteger = c => c.char.codePointAt(0);

var integer$Mn$Gtchar = i => {
    return {char: String.fromCodePoint(i)};
};

var string$Mntake = (s, n) => s.slice(0, n);

var string$Mndrop = (s, n) => s.slice(n);

var string$Eq$Qu = mk_seq_rel(
    (a, b) => string$Qu(a) && string$Qu(b) && a == b
);

var string$Mnmatch = (pat, s) => s.match(new RegExp(pat))||false;
var number$Qu = x => typeof(x) == 'number';

var number$Mn$Gtstring = (e, radix=10) => {
    if (isFinite(e)) return e.toString(radix);
    if (e > 0) return "+inf.0";
    if (e < 0) return "-inf.0";
    return "+nan.0";
};

var string$Mn$Gtnumber = (s, radix=10) => {
    if (s == "+inf.0") return Infinity;
    if (s == "-inf.0") return -Infinity;
    if (s == "+nan.0") return NaN;
    if (s.indexOf('.') >= 0) {
	assert(radix == 10);
	return parseFloat(s);
    }
    return parseInt(s, radix);
};
var vector$Qu = x => typeof(x) == 'object'
    && typeof(x.vector) == 'object'
    && Array.isArray(x.vector);

var make$Mnvector = (k,f) => { return {vector: Array(k).fill(f)} }

var vector = (...xs) => {return {vector: xs} }

var list$Mn$Gtvector = l => {
    if(Array.isArray(l)) return {vector: l};
    else throw "list->vector wrong type argument"
}
var vector$Mn$Gtlist = v => v.vector;

var vector$Mnlength = v => v.vector.length;

var vector$Mnref = (v,k) => v.vector[k];

var vector$Mnset$Ex = (v,k,o) => v.vector[k]=o;

var vector$Mnfill$Ex = (v,f) => v.vector.fill(f);
var make$Mnparameter = (init) => {
    var s = [init];
    var axs=(...a)=>(a.length==0)?s[s.length-1]:s[s.length-1]=a[0];
    axs.stack = s;
    return axs;
};

var push$Mnparameter = (param, value) => param.stack.push(value);

var pop$Mnparameter = (param) => param.stack.pop();
var input$Mnport$Qu = x => typeof(x) == 'object'
    && typeof(x.readChar) == 'procedure'
    && typeof(x.peekChar) == 'procedure'
    && typeof(x.charReady) == 'procedure';

var output$Mnport$Qu = x => typeof(x) == 'object'
    && typeof(x.writeChar) == 'procedure'
    && typeof(x.writeString) == 'procedure';

class InputStringPort {
    constructor(string) {
	this.string = string;
	this.tip = 0;
    }

    readChar() {
	if (this.tip >= this.string.length) {
	    return __EOF;
	}
	return {char: this.string[this.tip++]};
    }

    peekChar() {
	if (this.tip >= this.string.length) {
	    return __EOF;
	}
	return {char: this.string[this.tip]};
    }

    charReady() {
	return this.tip < this.string.length;
    }
};

class OutputStringPort {
    constructor() {
	this.string = "";
    }

    writeChar(c) {
	this.string += c.char;
    }

    writeString(s) {
	this.string += s;
    }
};

let fs = (typeof(require) == 'function')
    ? require('fs')
    : {
	readSync: (fd, buffer) => { buffer[0]='?'; },
	writeSync: (fd, string) => {console.log(string);},
	closeSync: (fd) => {},
    };

class InputFilePort {
    constructor(fd) {
	this.fd = fd;
	this.buffer = (typeof(Buffer) == 'undefined')
	    ? []
	    : Buffer.alloc(1);
	this.charsUnread = [];
    }

    readChar() {
	if (this.charsUnread.length > 0) {
	    return this.buffer.pop();
	}
	
	let bytesRead = fs.readSync(this.fd, this.buffer);
	if (bytesRead < 1) {
	    return __EOF;
	}
	return {char: this.buffer.toString('utf8')};
    }

    unreadChar(c) {
	this.buffer.push(c);
    }

    peekChar() {
	let c = this.readChar()
	this.unreadChar(c);
	return c;
    }

    charReady() {
	if (this.charsUnread.length > 0) {
	    return true;
	}
	return; // TODO przemyslenia
    }

    close() {
	return fs.closeSync(this.fd);
    }

};

class OutputFilePort {
    constructor(fd) {
	this.fd = fd;
    }

    writeChar(c) {
	return fs.writeSync(this.fd, c.char);
    }

    writeString(s) {
	return fs.writeSync(this.fd, s);
    }

    close() {
	return fs.closeSync(this.fd);
    }
};

let stdin = new InputFilePort(0);

let stdout = new OutputFilePort(1);

let stderr = new OutputFilePort(2);

var current$Mninput$Mnport = make$Mnparameter(stdin);

var current$Mnoutput$Mnport = make$Mnparameter(stdout);

var current$Mnerror$Mnport = make$Mnparameter(stderr);

var call$Mnwith$Mninput$Mnstring = (string, f) => {
    return f(new InputStringPort(string));
};

var call$Mnwith$Mnoutput$Mnstring = (f) => {
    let p = new OutputStringPort();
    f(p);
    return p.string;
};

var with$Mninput$Mnfrom$Mnstring = (string, f) => {
    let p = new InputStringPort(string);
    push$Mnparameter(current$Mninput$Mnport, p);
    try {
	return f();
    }
    finally {
	pop$Mnparameter(current$Mninput$Mnport);
    }
};

var with$Mnoutput$Mnto$Mnstring = (f) => {
    let p = new OutputStringPort();
    push$Mnparameter(current$Mnoutput$Mnport, p);
    try {
	f();
    }
    finally {
	pop$Mnparameter(current$Mnoutput$Mnport);
    }
    return p.string;
};

var read$Mnchar = (p = current$Mninput$Mnport()) => p.readChar();

var peek$Mnchar = (p = current$Mninput$Mnport()) => p.peekChar();

var char$Mnready$Qu = (p = current$Mninput$Mnport()) => p.charReady();

var close$Mninput$Mnport = p => p.close();

var write$Mnchar = (c, p = current$Mnoutput$Mnport()) => p.writeChar(c);

var write$Mnstring = (s, p = current$Mnoutput$Mnport()) => p.writeString(s);

var newline = (p = current$Mnoutput$Mnport()) => p.writeChar({char: '\n'});

var close$Mnoutput$Mnport = p => p.close();
var serialize = e => {
    switch(true) {
    case null$Qu(e): return "()";
    case boolean$Qu(e): return e ? "#t" : "#f";
    case number$Qu(e): return number$Mn$Gtstring(e);
    case char$Qu(e): return "#\\"+charName(e);
    case symbol$Qu(e): return symbol$Mn$Gtstring(e);
    case string$Qu(e): return JSON.stringify(e);
    case vector$Qu(e): return "#("+e.vector.map(serialize).join(" ")+")";
    case pair$Qu(e):
	if(Array.isArray(e))
	    return "("+e.map(serialize).join(" ")+")";
	if (improper$Qu(e))
	    return "("+e.improper.map(serialize).join(" ")
	    + " . " + serialize(e.tail) + ")";
	return "(" + serialize(e.car) + " . "
            + serialize(e.cdr) + ")";
    case procedure$Qu(e): return "#<"+e.toString()+">";
    case eof$Mnobject$Qu(e): return "#<eof-object>";
    default:
	if (typeof(e) == 'object') {
	    if (e.constructor.name == "Object") {
		return "#<"+JSON.stringify(e)+">";
	    }
	    return "#<"+e.constructor.name+JSON.stringify(e)+">";
	}
	return "#<"+typeof(e)+">";
    }
};

var equal$Qu = (x,y) => serialize(x) == serialize(y) /// XD

var writeln = e => { console.log(serialize(e)) ; return e };

let stringify = (e) => {
    if(string$Qu(e)) {
	return e;
    }
    return serialize(e);
}

var error = (...msg) => { throw new Error(msg.map(stringify).join('')); };

var invalid$Mnexample =
    make$Mnparameter((expression, actual, expected) =>
	(typeof(expected) == 'undefined')
	    ? error("expected ",expression," to be non-#false")
	    : error("while evaluating\n\n  ",
		    expression,
		    "\n\nexpected:\n\n  ",
		    expected,
		    "\n\ngot:\n\n  ",
		    actual, "\n"))

var valid$Mnexample =
    make$Mnparameter((expression, actual, expected) => actual);
var min = Math.min;

var max = Math.max;

var chapters = list(string$Mnsplit("Pat Panackelty\n\nAs you descend from hypnagogia\ninto blissful slumber - a more\nchiselled and defined version of the\ndream-like world appears in front of\nyou. One that is, so to speak, more\nreal, and more true to the inherent\nquality of fantasy worlds: limited\nonly by the boundaries of imagination.\n!jeannie\n\nAt first, you fly high in the sky,\nonly occasionally seeing the cloudy\ncurtain reveal worlds of intriguing\nbeauty, resplendent colours,\nfantastical beings and nature with\nmonumental wonders of oddly-shaped\narchitecture.\n\nYou let them come and go as easily\nas they appear, but only after you've\nbreathed their essence, and the\nsequence of their appearance seems\nto make sense to you on some level,\neven though they are so much\ndifferent from one another, and it\nfeels like it's not really you\nwho controls what and when is being\nrevealed.\n\nYou bathe in the pleasant visions\nfor what feels like eons almost\ndissolving in the end. Who are you?\nYou forgot!\n\nPat Panackelty\n","\n"),string$Mnsplit("You descend onto a desert, and thump\ngently onto the ground. A few moments\npass, and only a tumbleweed clutters\nthe never-ending vastness of the\nlandscape. You are starting to get\na little bored when suddenly - what\nappears to be a portal - expands\nvertically. Once it's about human size\na man jumps out of it holding a sewing\nmachine under his arm.\n\nA sewing machine is a device for\nlinkingpieces of fabric together. \nBut you already knew that, right?\n\nHe brushes off some dust of hisbeautiful,\nbut a little flashy suit, then looks\ndown at his watch, and before you can\nutter a word, jumps quickly into another\nportal appearing right in from of him.\n\nYou feel mildly disappointed. However,\nnot a second has passed when a portal\nbehind you opened up, you turn around\nand see the very same man, this time\ndropping his machine as he falls on his\nhands and knees. You notice an arrow\npierced through his fleece, he appears\nunharmed though. He stands up vigorously\ndusting the suit off, visibly angry.                                              \n\n\"Hello\" - you say                                                                     \nHe turns his eyes up towards you briefly,\nthen continues to groom himself.\n\n\"Hello!\" - you say a little louder\n\n\"I'm quite busy here...\"\n\n\"What are you doing?\" \n\n\"See these?\" He points at one of the \nportals that constantly reappear in\nvarious places at random intervals.\n\"These are portals to other worlds\"\n\n\"You mean fantasy worlds?\"\n\n\"No, no\" seems to have calmed down now\nthat he's grabbed your attention.\" These\nhead to different time periods of this\nplanet\"\n\n\"And what is this?\" you pretend you didn't\nknow.      \n\n\"Oh, it's a sewing machine. I've been\ntrying to sell it\"\n\nHe turns his glance toward the the arrow\nangrily, but not as much as last time,\nand removes it.\n\n\"It hasn't been going very well, has it?\"\nyou pause. \"You do this everyday?\"\n\n\"Yeah that's what I do\"\n\n\"I must say, it's very impressive\"\n\n\"Oh yeah?\"\n\n\"What happened?\"\n\n\"I was trying to get a few trinkets for\nit from a brute who tried to apply it\non leather. I tried to tell him to stop,\nbut he was a little overenthusiastic\nto try it out.\"\n\n\"Good thing you're OK\"\n\nThe salesman straigthens out, and had a\nslight expression of worry on his face,\nbut very quickly smiled.\n\n\"I was in the wrong time period\"\n\nA portal opens up, horizontally this \ntime, and a blue car pops out. The\nsalesman opens the trunk, throws the\nmachine in it, and says: \"I always wanted\nto start a fashion coutoure business.\"\nShuts the trunk, jumps in \"Later kiddo!\" \nhe waves as he drives off.\n\nYou look at the car and the large trail\nof dust behind it as it drives away\ntoward the horizon.\nBefore you can decide whether you're\ndisappointed or inspired, a portal\nopens up above you.\nThis one is a little different, you can\nsee through it a beautiful blue sea,\nsome tiny seaguls drifting in the sky.\nTheir movement gave the sea a new\ndimension, a sliding parallax that made\nthe height and depth more apparent. You\njump up without hesitation, and as soon\nas you cross the portal your weight sheds.\n","\n"),string$Mnsplit("You fly further over a blue sea. It's\nvery sunny, and the birdseye view is\nnice with a certain warmth about it,\nnot to mention the sunny breeze on your\nface. You can see a little port town\nsliding into the view. It's very\npicturesque with pastel colours of cute\nhouses playfully complimenting the blue\nwaters. You land and wander in the port\nfilled with quaint little boats,\nvibrant chatter, and a stray cat or two.\n\nYou approach a red cat and it makes\nthe lovliest of purrs. You pet her \naffectionally and her fur feels nice\nand  soft. She brushes against your leg,\nand runs away a little bit, turns her\nhead back, obviously wanting for you to\nfollow.\n\nAs you do, she dissapears around the\ncorner of an alley. Once you arrive at\nthe turn you realize you may have lost\ntrack of her for a little bit.\n\nShe reemerges from a carboard box looking\nat you from a distance and meaowing twice.\nAs you approach, you notice two tiny\nkittens sleeping and huddling in a nest\nput together from an old hat and some rags.\n\nShe starts breast-feeding them, and you\nwatch for a while, as the little ones\nare making 'cookie dough' with their\npaws. The kittnes now fully fed, fall\nback calmly into sleep.\n\nThe mature cat, on the other hand seems\nonly to have started as your tour guide.\nYou stroll into the dark end of the\nalley only to see an opening with a path\nleading toward a house nestled within\nthe trees.\n\nThe cat runs in through an open door.\nYou're a little hesitant to go in at\nfirst, but the pleasant cool draft\ncoming from the shady abode lures you in.\n\nYou can see 'Red' - as you've now\ncalled  her - mowing down on some food\nvoraciously in the corner of the room.\nThe room is  filled with flasks, old\ntomes, and  circuitous glass contraptions\nof some sorts. You pan the room, and in\nthe opposite corner, almost barely\nvisible, an old man is hidden behind a\nrack of vials and a stack of books.\n\nHe mumbles something briefly, and rather\nangrily giving you only the shortest\nside-glance of acknowledgement.\n\n\"I'm conducting an experiment. See this\nlittle stone?\" he points at a rough\npiece of grey rock. You nod.\n\"I've been trying for years now to\ntransform it into gold.\"\n\n\"Why doesn't it work?\"\n\n\"That's a good question! I thought I\nhad all the steps worked out down to\nthe tee.\"\n\nYou wander around curiously exploring\nthe room occasionally shyly standing on\nyour toes to better see what's on the\nshelves.  You see a flask of an unusual\ncolour, the alchemist interrupts your\nexploration.\n\n\"Not sure if that's the right colour\"\nYou peer over your shoulder,\nonly to realize he's speaking to himself\nas he studies the rock.\nAs you turn back you lose balance on\nthe stool you've been standing on, and\ntrying to grab the shelf for stability.\nYou pull the beautiful flask and it\nbreaks with its contents next to you\non the floor.\n\"Oh, you careless child! Look what you\ndid! Are you alright?\"\n\n\"Yes, I think so\" You reply rubbing your\nknee and looking for cuts. He helps you\nstand up, and notices a red gem right\nbeside the broken glass. He picks it up,\ntakes out his monocle, and observes the\nstone with an intense look.\n\n\"Ah, it's a memoir of a trip my parents\ntook me for when I was about your age.\nWe went to the beach and were collecting \nsea glass.\"\nHe pauses pensively\n\"This particular one, though, attracted\nme by the shape.\" Says, as if to himself.\nYou look at the red stone and it has a \ndistinct heart-shaped look. \n\n\"The stone?\"\n\n\"No, no. There was a girl there. She\nhad big blue eyes, jet-black hair, a\nspark of wit about her presence, and a\ncute little nose.\" He nods approvingly.\n\"She was with her parents too.\" He\ncontinues. \"Our families had lunch \ntogether later, and we built an anemometer\nfrom the debris found on the beach. It\nwas a lot of fun!\"\n\n\"What's an anemometer?\"\n\n\"It's a device for measuring wind strength.\nI took this red piece of sea glass we\nfound, and formed it into this shape.\nA year later I met her again on that\nvery same beach, and gave it to her.\nShe was  very surprised, but took it\nand smiled.\"\n\n\"What happened to her?\"\n\n\"I never saw her again on that beach. \nWe met one more time - at the university.\"\nHe sighs.\n\"Unfortunately for me, she was already\nmarried.\"\n\n\"Sorry to hear that.\"\n\n\"She visited me a few months ago, gave\nme the flask - it was cat medicine she'd\nbeen researching. She thanked me for\ninspiring her to do research. The gem\nmust have been hidden inside the bottle,\nstrange. I never noticed it when I helped \nthis old wounded cat the other day.\"\nHe pauses. \"She must have kept it all \nthose years...\"\n\nA trace of a tear appears in the corner\nof his eye, and his face seems to have \ngained a child-like joy.\n\"A-ha!\" he exlaims.\n\"It must be about the shape!\"\n\nHe pockets the eyeglass and the stone,\ngoes back to his desk and starts shaping\nthe stone he left there. After a few \nminutes he arrives at a round shape,\nand  drops it into a funnel on one side\nof the machine. After a series of clunks\nand hisses, a golden orb comes out on\nthe  other end.\n\"Here you go, my child\" he says as he\ngives it to you.\n","\n"),string$Mnsplit("You say goodbye and walk down the forest\npath enjoying the sun filtered by the\ngentle rustle of leaves.\n\nThe path ends, and the animals swarm\nout and scatter. You're alone now, thirsty,\nbut you get an eerie feeling like you're\nbeing observed. You don't think you can\nmake it back through the path before\nsun goes down. You decide to follow the\nanimals to where you think they went to.\nThey should at least know where water is,\nright?\n\nYou can smell smoke, that reminds you\nof the time when you put marshmallow-\n-filled biscuits in the oven and forgot -\n- except more pleasant.\n\nYou follow, and eventually can see a\nlake, and a bus parked near it.\nYou approach.\n\n!image:images/obrazek.png\n\nAs you advance you\nrealize the bus has been long out of\nfunction. At least its original one.\nIt's painted in green, orange, and\npurple. You think that someone very\ncreative must have painted it. There\nare some bushes with berries on the \nsides of it, and trees with fruit growing\non them. You decide to take a gander\ninside the bus, as the door is wide\nopen. There is old but fanciful furniture\ninside with comfy pillows of different\nshapes and colours. Some plants are\npotted inside, which is a nice touch,\nand it feels like the bus was claimed\nby nature in a way. Nobody's home.\n\nYou turn toward the lake, and you see\nthe same swarm of animals you think you\nsaw before, racing toward a faint glow\nin the distance. You come closer and can\nnow see someone with their back turned\nto you, sitting in a little chair next\nto a campfire by the lake shore. The\nanimals seem to be flocking around,\nattracted not only by the warmth, but\nan air of generosity of the person\nfeeding them out of her hand. This must\nbe where the smoky smell of food is\ncoming from. \n\nYou approach and are greeted by a bright\nsmile of a lady with pink hair. One of\nher eyes is red, and the other is blue. \n\n\"I'm Jeannie. What's your name little imp?\" \n\n\"I'm Pat\"\n\n\"Nice to meet you Pat. Come, sit down.\"\n\nYou sit down next to her and you have\na snack and something to drink. Jeannie\ngives you a blanket to keep you warm,\nand you watch the sun set over the trees\nat the other end of the lake.\n\n\"What do you do here, Jeannie?\" She\ntakes a  sip out of a bottle.\n\n\"I take care of the animals here, and\nthey care for me. I give them food, and\nshelter. I pick up the trash people\nleave, and sometimes turn it into\nfurniture\"\nYou can see that a little table beside\nis made of different kinds of materials.\nYou notice an expression of sadness in\nJeannie's face as she tends to the fire.\nYou are impressed by the skill she handles\nthe fire though.\n\n\"How did you make this fire?\"\n\n\"I collected some dry grass, small\nsticks and firewood from the forest.\nI then used a mirror, to reflect the\nsunlight onto the dry grass.\"\n\n\"Why are you sad?\" She thinks for a\nminute without revealing any emotion,\nthen a smile comes back.\n\n\"There was this one guy... Let's call\nhim Jack of Clubs. He could always make\nme laugh, and he used to come here often.\nHe had these great ideas and plans, but\nnever finished any of them. Never left\nme a note or anything. Then there was\nthis other one that I hoped would hang\nout a little longer. He told me everything\nI needed to hear to feel loved and cared\nfor. Maybe a little more than I should\nhave believed in. We did great things\ntogether. Then one day I turned and\nthere was a diamond on my pillow. No\nnote either.\"\n\n\"Jack of Diamonds?\"\n\n\"Bingo\"\nYou hear a little rustle in the darkness,\nyou turn toward it, but can't see anything\n\n\"What's your story?\"\n\n\"I was flying in the sky, and then I\nlanded on a desert with all those portals\nthat led into different time periods.\nThere was a man who had a great business\nidea... \nHe just didnt't know it at the time.\"\nJeannie giggles.\n\"Then I arrived at the port on this\nisland here, a cat led me to a home at\nthe edge of the forest. A wise old man\nlived there. I came in, fell down,\nbroke a bottle, but I was okay. And it\nwas okay. He gave me a present.\"\n\n\"Is that so?\"\nYou nod, and take out the golden orb\nand put it on the table with a little\nthud. You could swear you could hear a\nrustle again, from the direction\nof nothing but pitch black.\n\"Okay, I think it's bed time for me, Pat\"\nYou feel tired too, and can't remember\nwhere your bed was.\n\"There's a very comfortable seat for\nyou to sleep on in the bus.\" Says Jeannie.\n\nYou wake up, and see Jeannie fast asleep.\nYou feel restless though, and wish to\ncontinue your adventure. You take a piece\nof paper out of a stack, and a pen and\ngo back to the campfire. Where there was\nfire  yesterday you can now see embers,\nand the forest creatures are all gone.\nYou gather some small sticks and cattail\nfluff for a while, and put it next to\nthe firepit. A brisk wind is coming from\nthe lake.  You wrap yourself in a blanket,\nsit down, and write:\n\n\"Dear Jeannie,\n\nThank you - the seat was comfortable.\nWe forgot to put out the fire, but at\nleast you don't need sparks for the\ncattail fluff. I hope the animals return\nonce you bring the fire back to life.\n\nYour friend, Pat\"\n\nYou put the letter under the orb, so\nthat the wind doesn't blow it away,\nand leave through a path you never\nnoticed yesterday.\n","\n"),string$Mnsplit("It's a beautiful morning, and the forest\nfeels comforting again. The birds are\nsigning, there's a parrot squawk, you can\nhear some unspecified mammal sounds, and\nthe butterflies seem to have decided to\naccompany you for a while.  A silhouette\nof something resembling a palace or a\ncastle emerges through the clearing in\nthe distance.\n\nThe serenity is suddenly broken by the\ngood old rustling behind you\n'That's it!' You think, angrily.\n\"Show yourself!\" You scream as you turn\naround toward the rascal with your teeth\nand fists clenched.\n\nThe rustling stops, and you were about\nto walk away, but it resumes, and you\ncan see a dark hooded figure stepping\nout of the brush. He seems mildly\nembarrassed.\n\n\"What do you want?!\"\n\nThe rogue approaches gingerly, scaling\nyou up as his feet find his way down the\nnarrow path. He stops at a safe distance,\nyou can now see his young and slightly\nconcerned face. Than takes something out\nof his pocket and tosses it toward you\non the path looking at you expectantly.\nIt's the  orb you left at Jeannie's!\n\"You forgot something\" He says - to your\nsurprise. You pick the orb up, and look\nback at the young man, curious. He smirks,\nand as he turns away his cape flutters.\nYou're puzzled. He glances through the\nshoulder and shouts\n\"By the way, Jeannie says thanks\"\n","\n"),string$Mnsplit("You venture forth deeper into the forest,\nenjoying the weather, the views and the\nair cooled off by the shade cast by the\ntrees above you.\n\nFinally, you arrive at a bridge that\nleads to the palace courtyard. There's\na line of solidiers along the walkway\nto the palace enterance.\n\nTheir serious expressions make you\nhesitate for a moment, and you can hear\na growl in your stomache. You're hungry.\nAs you look around you notice a house\nwith a \"Cuisine\" sign on top of the door.\nYou're not sure what it means but you're\nhoping it has something to do with the\nsmell of food coming from that direction.\n\nYou come in, to a large room, a chef is\nimmersed in a task, jumping around the pot,\nmumbling something. Disapproval. Pinch\nof salt. Taste. Approval. He has a tall\nwhite hat pleated at the top.\n\nHe turns around to you as you approach.\nHe's a rotund man with a thin and long\npointy mustache. He extends his arm with\nhis eyes closed and a cheerful smile.\nYou shake his hand.\n\n\"Ah, you must be the new chef the partie.\"\nYou're not sure, and you don't feel\nlike having a party right now, but you\naccept the invitation.\n\n\"Yes\" He browses a wardrobe for a moment,\nand says:\n\"Yes, zis one will be exquisite\"\nHe hands you over a hat, not a party\nhat - it' similar to his, except smaller.\nYou wear the hat.\n\"Today we'll be making crepes! Have you\nmade crepes before?\"\n\n\"No\"\n\n\"Not to worry, I'll teach you. Come\"\nHe puts a recipie in front of you. As\nyou read the ingriedient list, he gathers\nthe required items in front of you.\n\"Get a large bowl ready.\" He puts a bowl\nin front of you and one in front of him.\n\"Crack sree eggz into ze bowl. Add two\nceups and two tablespoons of flour into\nze bowl, pour in a ceup of meelk and a\nceup of water, add four tablepoons of\noil and a pinch of salt.\" You're asked\nto measure the correct amounts. Luckily,\nyou are given a tablespoon, a cup,\nand your fingers can do the pinching.\n\"Meex for a few minutes until ze meexteure\niz smooz\" He gives you a wooden spoon.\n\"Melt between a fifs or a quarter of\nbutter on very low eet at ze sem time\neet eup a non-steek pan to medium eet.\"\nYou can see the pans already on the\nstove. He helps you set the heatcorrectly.\n\"Lift ze 'ot pan and brush a leetehl\nmelted butter onto it.\"\n\n\"Drip between ahf or two-serds of a\nladle onto ze pan making cheur ze\nleequid distreeboots evenlee.\"\n\n\"Don't put too little or too much.\nJust ze right amount. So when cooked\non ze under side, it doesn't splash ze\nuncooked dough as you flip it over.\"\nHe pours the dough onto the pan tilting\nit to make sure the surface is covered.\n\n\"Put ze pan back and wait for under a\nmeenute until ze crepe iz soleed and\nsteam comes out from ze bottom of it\"\nAfter about a minute, he lifts the pan,\nand shakes it horizontally, and you can\nsee the pancake slide back an forth.\n\n\"Pick eup ze pan and flip ze crepe in\nze air to ze ozer side. Like zis\" He\ntosses the pancake into the air, and\nlands it perfectly as if was a piece\nof cake. Got it? You did, and...\n\nNow's the time! The pancake flips, with\nlittle force applied.\n*Pat* It lands half-folded on the pan.\n\n\"Don't worry. Next time try to cook it\na few seconds longer\" You throw zis...\nekhm, this one away not at all discouraged\nQuite the opposite! You close your eyes,\nand swing the pan full blast. *Splat!*\nYou hear. You look up to see the crepe\nstuck to the ceiling. Not for long, as\nit falls right onto his face.\n\n\"Tout ce qui monte doit redescendre...\"\nHe mumbles in French.\n\"What goes up must come down\"\n\nYou tilt your head forward with an\nintense squint of concentration, and\ntry again. *Zing!* It lands perfectly.\nYou curtsy with your pan still in your\nhand.\n\n\"Bravo!\" he claps with a smug expression\n\"Lay ze pan back on ze stove and cook\nfor about ahf ze time you cooked on ze\nozer side until you can see some steam\nagain, flip ze pan over a plate to remove\nze ready crepe\". You finish the rest of\nthe crepes with more ease.\n\n\"Go through zis door to discuss your\ncompensation\" He points at a door in\nthe other side of the kitchen. You go\nthrough, and follow a path that leads\nto the palace through an olive grove.\n","\n"),string$Mnsplit("You march in through the large door\nthat opened itself in front of you.\nOn the  throne sits a beautiful lady.\nShe seems to be enjoying the conversation\nwith the courtiers, but immediately\nturns your face towards you as soon as\nyou enter, and all the lively chatter\nstops at once. \"You there!\" She says\nsoftly, and treats you with the most\nkind of smiles you've ever seen. As if\nshe were still a child deep down in her\nheart.\n\n\"It's very brave of you to have come\nhere all by yourself\"\n\n\"It wasn't all that scary\" It kind of\nwas, but you are feeling encouraged.\n\n\"I've been waiting for you for a long\ntime\"\n\n\"How so?\"\n\n\"Let's just say you've made an impact\nwithout even knowing it.\"\n\n\"This is a really pretty palace\"\nThe crowd seem to approve with cheerful\ngiggles here and there. They offer you\nsome of the most delicious food you've\never eaten.\n\n\"A little bird told me you'll be coming.\"\nA little bird lands on her shoulder indeed.\nThat must be him.\n\"I have a gift for you\" The courtiers\npassa box from to another from the back\nof the hall, all the way to the dame.\nShe opens the box, and there's a pair\nof keys linked together in it. She\ngestures at you to come closer, and you\ndo with hesitation. \"You can come here\nwhenever you want. All you have to do\nis close your eyes and think of this\npalace here.\"\n\n\"Thank you.\" You take the keys.\n\nYou strut out of the palace proudly,\nand as you gather your thoughts before\nanother take off, you decide to stroll\ninto the garden. You sit down for a bit,\nenjoying the weather, and finding\ncomfort in the ambience of the lush\nsurroundings. You are trying to make\nsense out of all of what happened today.\nSome time passes. A crow lands down on\nthe side of the bench and asks.\n\n\"What's the matter, child?\" He has a\ndistinct rolling 'r' as if trying to\ncontain a tongue longer than his\ndisproportionally large beak.\n\n\"I just received keys to the palace,\nand I don't know why\" you look at the\nfloor tiles in front of you.\n\n\"Perhaps a little *reminder*, I shall\nbestow upon you, shan't I?\"\n\n\"What?\" you turn quickly toward the\ncrow, but he doesn't seem to have any\nintention of answering. Instead, he\nstarts turning his head in circles in\nyour general direction, as if casting\na spell on you. *Poof*, you turn into\na frog. Right at this second, a cook\nappears between you and the path back\nto the palace.\n\n\"Ah, mon petite grenouille, zere you are!\"\nexlaims the cook, and starts pacing\ntoward you with a cleaver raised.\n\n\"You may want to start rrrunning\".\nSuggests the crow, and while you couldn't\nagree more, you realize your legs are\nnot particularly well suited for the\ntask. That being said, you decide you'd\nstill like to keep them.  You start\nhopping as fast as you can, but he who\nwas once an affable teacher, and whom\nyou know perceive as a savage monster,\nis unfailingly closing the gap behind\nyou. You leap into a hedge maze, as you\ntry to cling onto your dear life.\n\nYou see Red jumping out of the bushes,\nmeaowing at you with worry but happy\nthat she can see you. She's on the\nother side of the river. You think of\nanything that could help you defeat\nyour predator, and you wished the game\ngave you more items to interact with\nthan just a set of keys and a golden\norb. In an act of desperation you throw\nthe golden orb in front of the chef,\nthe monster has finally caught on, and\nyou know you're it. There's only that\nlittle orb between you and him. As\nthere's no protection anymore. You hope,\nremembering what the final words spoken\nto you at the castle were, and close\nyour eyes. You're scared out of your\nmind as you wait for the inevitable.\nYou suddenly hear the beast roar, but\nnot in anger - it's fear! You hear a\nloud thud, and a thunderous impact\npropagates through the ground, followed\nby a loud meaow, and a splash of water\nSomehow you feel safe to open your eyes...\n","\n"),string$Mnsplit("You open your eyes slowly, and you\nrealize you're in bed. You were asleep!\nYou can smell a familiar fragrance.\nIt's unmistakenly blueberry muffins.\nYour head hurts.\n\nYou lift your gaze, blurry, still half-\n-trapped between sleep and waking, and\nyou can see your mom and dad. Your mom\nhas a colored shawl on her neck, with a\nsequence of small circles of various\ncolors, all jumbled up and embedded in it.\n\nThis place looks familiar. It's your\nbedroom!\n\nYour parents are very happy to see you,\nas if they haven't seen you for ages.\nYou try to speak and it's so exerting\nthat you raise in the bed only slightly\nbut fall back to the comfort of your bed\nwith a tired moan. \"That's okay sweetie\nIt takes time to recover.\" Says your mom\nsoothingly.\n\n\"My job is done here. She needs plenty\nof rest, and she'll be good as new in a\nmatter of days!\" Said a man in a suit\nwith a large leather bag, and a\nstethoscope. As he's packing his things,\nyou notice a boy with red hair juggling\na small golden football farther into the\nroom.\n\n\"This is Red\" Your mom points at him.\n\"He found you and your bike next to the\nroad.\"\nHe seems unmoved by the entire kerfuffle,\nenthusiastically juggling a small golden\nfootball. He stops as your gazes meet,\nputs the ball under his arm, and brings\na plate of muffins over to you.\n\"Here, my mom made these.\" he smiles.\n","\n"));


var images = {};
for (var chapter of chapters) {
  for (var line of chapter) {
    if (line.match(/^!image:/)) {
      var path = line.slice('!image:'.length);
      if (!(path in images)) {
        var img = new Image();
        img.src = path;
        images[path] = img;
      }
    }
  }
}
let image = (path) => images[path] || false;

var interactions = {};


var vertical$Mnscroll = 0;

var content$Mnheight = 0;

var line$Mnheight = 48;

var top$Mnmargin = 48;

var left$Mnmargin = 100;

var current$Mnchapter = 0;

var nextarrow$Mnleft = 0;

var nextarrow$Mntop = 0;

var nextarrow$Mnwidth = 0;

var nextarrow$Mnheight = 0;

var backarrow$Mnleft = 0;

var backarrow$Mntop = 0;

var backarrow$Mnwidth = 0;

var backarrow$Mnheight = 0;

var current$Mninteraction = false;

class Maze {
constructor(blocks, player, background, width, height, leftMargin, topMargin) {
  this.rows = blocks.length;
  this.cols = blocks[0].length;
  this.map = blocks;
  this.player = player;
  this.background = background;
  this.width = width;
  this.height = height;
  this.leftMargin = leftMargin;
  this.topMargin = topMargin;
  this.rotation = 0;

  for (var row = 0; row < this.rows; ++row) {
    for (var col = 0; col < this.cols; ++col) {
      if (blocks[row][col] == '@') {
        this.left = col;
        this.top = row;
      }
      if (blocks[row][col] == 'O') {
        this.targetLeft = col;
        this.targetTop = row;
        blocks[row][col] = ' ';
      }
    }
  }
}

finished() {
  return this.left == this.targetLeft && this.top == this.targetTop;
}

render(ctx, left, top) {
  ctx.drawImage(this.background, left, top);

  var x = left + this.leftMargin + this.left * this.player.width 
     + this.player.width/2;

  var y = top + this.topMargin + this.top * this.player.height
     + this.player.height/2;

  if (this.finished()) {
    return;
  }

  ctx.save();

  ctx.translate(x, y);

  ctx.rotate(this.rotation);
  ctx.drawImage(this.player, -this.player.width/2, -this.player.height/2);

  ctx.restore();

  var fog = ctx.createRadialGradient(x,y,this.player.width, x,y,2*this.player.width);
  fog.addColorStop(0, 'rgba(255,255,255,0.0)');
  fog.addColorStop(1, 'rgba(0,0,0,0.9)');

  var origFillStyle = ctx.fillStyle;
  ctx.fillStyle = fog;
  ctx.fillRect(left, top, this.background.width, this.background.height);
  ctx.fillStyle = origFillStyle;
}

keyPress(key) {
  switch(key) {
    case 'ArrowUp':
      if (this.top > 0 && this.map[this.top-1][this.left] == ' ') {
        this.map[this.top][this.left] = ' ';
        this.top -= 1;
        this.map[this.top][this.left] = '@';
      }
      this.rotation = 0;
      break;
    case 'ArrowDown':
      if (this.top < this.rows-1 && this.map[this.top+1][this.left] == ' ') {
        this.map[this.top][this.left] = ' ';
        this.top += 1;
        this.map[this.top][this.left] = '@';
      }
      this.rotation = Math.PI;
      break;
    case 'ArrowLeft':
      if (this.left > 0 && this.map[this.top][this.left-1] == ' ') {
        this.map[this.top][this.left] = ' ';
        this.left -= 1;
        this.map[this.top][this.left] = '@';
      }
      this.rotation = -Math.PI/2;
      break;
    case 'ArrowRight':
      if (this.left < this.cols-1 && this.map[this.top][this.left+1] == ' ') {
        this.map[this.top][this.left] = ' ';
        this.left += 1;
        this.map[this.top][this.left] = '@';
      }
      this.rotation = Math.PI/2;
      break;
    default:
      console.log('maze pressed '+key);
  }
}

keyRelease(key) {}

}


var _ = " ";

var X = "#";

var V = "@";

var O = "O";

var dont$Mnrepeat = false;


var board = new Image();
board.src = 'images/board.png';

var pat = new Image();
pat.src = 'images/pat.png';


slot$Mnset$Ex(interactions,{symbol: "jeannie"},new Maze([
  [_,_,_,X,X,X,O],
  [_,X,_,_,_,X,_],
  [_,_,X,X,_,_,_],
  [X,_,_,_,X,X,X],
  [_,_,V,_,X,X,_],
], pat, board, 480, 340, 9, 12))
var render = (()=>{
return ((canvas)=>{
return ((ctx)=>{
return (()=>{
canvas.width=$Mn(window.innerWidth,20);
;
canvas.height=$Mn(window.innerHeight,20);
;
ctx.font="26px californian";
;
current$Mninteraction=false;
;
return ((base,break$Qu)=>{
(($Gt(current$Mnchapter,0))===false?undefined:((()=>{
ctx.fillText("🠜",left$Mnmargin,$Mn(base,vertical$Mnscroll));
backarrow$Mnleft=$Mn(left$Mnmargin,10);
;
backarrow$Mntop=$Mn(base,vertical$Mnscroll,10);
;
((arrow)=>{
backarrow$Mnwidth=$Pl(arrow.width,20);
;
return backarrow$Mnheight=$Pl(arrow.emHeightAscent,20);
;
})(ctx.measureText("🠜"));
return base=$Pl(base,line$Mnheight);
;
})()));
for$Mneach(((line)=>{
return (((($Gt(string$Mnlength(line),1))===false
?(false)
:(equal$Qu(string$Mntake(line,1),"!"))))===false
?(((not(break$Qu))===false?undefined:((()=>{
ctx.fillText(line,left$Mnmargin,$Mn(base,vertical$Mnscroll));
return base=$Pl(base,line$Mnheight);
;
})())))
:(((hatch)=>{
return ((string$Eq$Qu(string$Mntake(hatch,string$Mnlength("image:")),"image:"))===false
?(((with$Mnslot$Qu(interactions,hatch))===false?undefined:(((widget)=>{
return (((($Gt($Mn(base,vertical$Mnscroll,$Mn(widget.height)),0))===false
?(false)
:($Ls($Mn(base,vertical$Mnscroll),window.innerHeight))))===false?undefined:((()=>{
widget.render(ctx,left$Mnmargin,$Mn(base,vertical$Mnscroll));
current$Mninteraction=widget;
;
base=$Pl(base,widget.height);
;
return ((not(widget.finished()))===false?undefined:((()=>{
break$Qu=true;
;
return break$Qu=true;
;
})()));
})()));
})(slot$Mnref(interactions,hatch)))))
:(((path)=>{
return ((img)=>{
return (()=>{
ctx.drawImage(img,left$Mnmargin,$Mn(base,vertical$Mnscroll));
return base=$Pl(base,img.height,line$Mnheight);
;
})();
})(image(path));
})(string$Mndrop(hatch,string$Mnlength("image:")))));
})(string$Mndrop(line,1))));
}),list$Mnref(chapters,current$Mnchapter));
(((($Ls(current$Mnchapter,$Mn(length(chapters),1)))===false
?(false)
:(not(break$Qu))))===false?undefined:((()=>{
ctx.fillText("🠞",$St(4,left$Mnmargin),$Mn(base,vertical$Mnscroll));
nextarrow$Mnleft=$Mn($St(4,left$Mnmargin),10);
;
nextarrow$Mntop=$Mn(base,vertical$Mnscroll,10);
;
((arrow)=>{
nextarrow$Mnwidth=$Pl(arrow.width,20);
;
return nextarrow$Mnheight=$Pl(arrow.emHeightAscent,20);
;
})(ctx.measureText("🠞"));
return base=$Pl(base,line$Mnheight);
;
})()));
return content$Mnheight=$Pl(base,line$Mnheight,top$Mnmargin);
;
})(top$Mnmargin,false);
})();
})(canvas.getContext("2d"));
})(document.getElementById("canvas"));
});

window.addEventListener("resize",render)
window.addEventListener("load",render)
window.addEventListener("click",((event)=>{
return (((($Ls$Eq(nextarrow$Mnleft,event.x,$Pl(nextarrow$Mnleft,nextarrow$Mnwidth)))===false
?(false)
:((($Ls$Eq(nextarrow$Mntop,event.y,$Pl(nextarrow$Mntop,nextarrow$Mnheight)))===false
?(false)
:($Ls($Pl(current$Mnchapter,1),length(chapters)))))))===false
?((((($Ls$Eq(backarrow$Mnleft,event.x,$Pl(backarrow$Mnleft,backarrow$Mnwidth)))===false
?(false)
:((($Ls$Eq(backarrow$Mntop,event.y,$Pl(backarrow$Mntop,backarrow$Mnheight)))===false
?(false)
:($Gt$Eq($Mn(current$Mnchapter,1),0))))))===false?undefined:((()=>{
current$Mnchapter=$Mn(current$Mnchapter,1);
;
vertical$Mnscroll=0;
;
return render();
})())))
:((()=>{
current$Mnchapter=$Pl(current$Mnchapter,1);
;
vertical$Mnscroll=0;
;
return render();
})()));
}))
document.addEventListener("wheel",((event)=>{
vertical$Mnscroll=max($Mn(top$Mnmargin),min($Mn(content$Mnheight,window.innerHeight),$Mn(vertical$Mnscroll,event.wheelDeltaY)));
;
return render();
}))
document.addEventListener("keyup",((event)=>{
return ((current$Mninteraction)===false?undefined:((()=>{
current$Mninteraction.keyRelease(event.key);
return render();
})()));
}))
document.addEventListener("keydown",((event)=>{
return ((current$Mninteraction)===false?undefined:((()=>{
current$Mninteraction.keyPress(event.key);
return render();
})()));
}))
