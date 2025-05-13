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
    make$Mnparameter((expression, actual, expected) => actual)

var slot$Mnref = (x, prop) => x[symbol$Mn$Gtstring(prop)];
var slot$Mnset$Ex = (x, prop, v) => x[symbol$Mn$Gtstring(prop)] = v;
var min = Math.min;
var max = Math.max;
var chapters = list(string$Mnsplit("Pat Panackelty\n\nAs you descend from hypnagogia\ninto blissful slumber - a more\nchiseled and defined version of the\ndream-like world appears in front of\nyou. One that is, so to speak, more\nreal, and more true to the inherent\nquality of fantasy worlds: limited\nonly by the boundaries of imagination.\n\nAt first, you fly high in the sky,\nonly occasionally seeing the cloudy\ncurtain reveal worlds of intriguing\nbeauty, resplendent colors,\nfantastical beings and nature with\nmonumental wonders of oddly-shaped\narchitecture.\n\nYou let them come and go as easily\nas they appear, but only after you've\nbreathed their essence, and the\nsequence of their appearance seems\nto make sense to you on some level,\neven though they are so much\ndifferent from one another, and it\nfeels like it's not really you\nwho controls what and when is being\nrevealed.\n\nYou bathe in the pleasant visions\nfor what feels like eons almost\ndissolving in the end. Who are you?\nYou forgot!\n\n//word game for title/name -\nmake out the name out of scrambled\nletters\n\n\nPat Panackelty\n","\n"),string$Mnsplit("You descend onto a desert, and thump gently\nonto the ground. A few moments pass, and\nonly a tumbleweed clutters the never-ending\nvastness of the landscape. You are starting\nto get a little bored when suddenly - what\nappears to be a portal - expands vertically.\nOnce it's about human size a man jumps out\nof it holding a sewing machine under his arm.\n\nA sewing machine is a device for linking\npieces of fabric together. But you already\nknew that, right?\n\nHe brushes off some dust of his beautiful,\nbut a little flashy suit, then looks down\nat his watch, and before you can utter a word,\njumps quickly into another portal appearing\nright in from of him.\n\nYou feel mildly disappointed. However, not\na second has passed when a portal behind\nyou opened up, you turn around and see the\nvery same man, this time dropping his\nmachine as he falls on his hands and knees.\nYou notice an arrow pierced through his\nfleece, he appears unharmed though. He\nstands up vigorously dusting the suit off,\nvisibly angry.                                              \n\n\"Hello\" - you say                                                                     \nHe turns his eyes up towards you briefly,\nthen continues to groom himself.\n\"Hello!\" - you say a little louder\n\"I'm quite busy here...\"\n\"What are you doing?\"                                                                  //blue\n\"See these?\" He points at one of the \nportals that constantly reappear in various\nplaces at random intervals.\n\"These are portals to other worlds\"\n\"You mean fantasy worlds?\"\n\"No, no\" seems to have calmed down now\nthat he's grabbed your attention.\n\"These head to different time periods of\nthis planet\"\n\n\"And what is this?\" you pretend you didn't\nknow.                                \n\"Oh, it's a sewing machine. I've been trying\nto sell it\"\nHe turns his glance toward the the arrow\nangrily, but not as much as last time, and\nremoves it.\n\"It hasn't been going very well, has it?\"\nyou pause.\n\"You do this everyday?\"\n\"Yeah that's what I do\"\n\"I must say, it's very impressive\"\n\"Oh yeah?\"\n\n\"What happened?\"\n\"I was trying to get a few trinkets for\nit from a brute who tried to apply it on\nleather.\nI tried to tell him to stop, but he was a\nlittle overenthusiastic to try it out.\"\n\"Good thing you're OK\"\nThe salesman straigthens out, and had a\nslight expression of worry on his face,\nbut very quickly smiled.\n\"I was in the wrong time period\"\nA portal opens up, horizontally this \ntime, and a blue car pops out. The salesman\nopens the trunk, throws the machine in it,\nand says:\n\"I always wanted to start a fashion coutoure\nbusiness.\" Shuts the trunk, jumps in\n\"Later kiddo!\" - he waves as he drives off.\n\nYou look at the car and the large trail of\ndust behind it as it drives away toward the\nhorizon.\nBefore you can decide whether you're\ndisappointed or inspired, a portal opens\nup above you.\nThis one is a little different, you can\nsee through it a beautiful blue see, some\ntiny seaguls drifting in the sky. Their\nmovement gave the sea a new dimension, a\nsliding parallax that made the height and\ndepth more apparent. You jump up without\nhesitation, and as soon as you cross the\nportal your weight sheds.\n","\n"),string$Mnsplit("You fly further over a blue sea. It's very\nsunny, and the birdseye view is nice with\na certain warmth about it, not to mention\nthe sunny breeze on your face. You can see\na little port town sliding into the view.\nIt's very picteresque with pastel colors\nof cute houses playfully complimenting \nthe blue waters. You land and wander in \nthe port filled with quaint little boats,\nvibrant chatter, and a stray cat or two.\n\nYou approach a red cat and it makes\nthe lovliest of purrs. You pet her \naffectionally and her fur feels nice and \nsoft. She brushes against your leg, and runs\naway a little bit, turns her head back,\nobviously wanting for you to follow.\n\nAs you do, she dissapears around the corner\nof an alley. Once you arrive at the turn\nyou realize you may have lost track of her\nfor a little bit.\n\nShe reemerges from a carboard box looking\nat you from a distance and meaowing twice.\nAs you approach, you notice two tiny kittens\nsleeping and huddling in a nest put together\nfrom an old hat and some rags.\n\nShe starts breast-feeding them, and you\nwatch for a while, as the little ones are\nmaking 'cookie dough' with their paws.\nThe kittnes now fully fed, fall back calmly\ninto sleep.\n\nThe mature cat, on the other hand seems\nonly to have started as your tour guide.\nYou stroll into the dark end of the alley\nonly to see an opening with a path leading\ntoward a house nestled within the trees.\n\nThe cat runs in through an open door. You're\na little hesitant to go in at first, but the\npleasant cool draft coming from the shady\nabode lures you in.\n\nYou can see 'Red' - as you've now called \nher - mowing down on some food voraciously\nin the corner of the room. The room is \nfilled with flasks, old tomes, and \ncircuitous glass contraptions of some sorts.\nYou pan the room, and in the opposite corner,\nalmost barely visible, an old man is hidden\nbehind a rack of vials and a stack of books.\n\nHe mumbles something briefly, and rather\nangrily giving you only the shortest side-\n-glance of acknowledgement.\n\n\"I'm conducting an experiment. See this\nlittle stone?\" he points at a rough piece\nof grey rock. You nod.\n\"I've been trying for years now to\ntransform it into gold.\"\n\"Why doesn't it work?\"\n\"That's a good question! I thought I had\nall the steps worked out down to the tee.\"\n\nYou wander around curiously exploring the\nroom occasionally shyly standing on your\ntoes to better see what's on the shelves. \nYou see a flask of an unusual color, the\nalchemist interrupts your exploration.\n\"Not sure if that's the right color\"\nYou peer over your shoulder,\nonly to realize he's speaking to himself as \nhe studies the rock.\nAs you turn back you lose balance on the\nstool you've been standing on, and trying\nto grab the shelf for stability.\nYou pull the beautiful flask and it breaks\nwith its contents next to you on the floor.\n\"Oh, you careless child! Look what you did!\"\n\"Are you alright?\"\n\"Yes, I think so\" You reply rubbing your\nknee and looking for cuts. He helps you stand\nup, and notices a red gem right beside the\nbroken glass. He picks it up, takes out his\nmonocle, and observes the stone with an\nintense look.\n\"Ah, it's a memoir of a trip my parents\ntook me for when I was about your age.\nWe went to the beach and were collecting \nsea glass.\"\nHe pauses pensively\n\"This particular one, though, attracted\nme by the shape.\" Says, as if to himself.\nYou look at the red stone and it has a \ndistinct heart-shaped look. \n\"The stone?\"\n\"No, no. There was a girl there. She had\nbig blue eyes, jet-black hair, a spark\nof wit about her presence, and a cute\nlittle nose.\" He nods approvingly.\n\"She was with her parents too.\" He\ncontinues. \"Our families had lunch \ntogether later, and we built an anemometer\nfrom the debris found on the beach. It was\na lot of fun!\"\n\"What's an anemometer?\"\n\"It's a device for measuring wind strength.\"\n\"I took this red piece of seaglass we found,\nand formed it into this shape.\nA year later I met her again on that very\nsame beach, and gave it to her. She was \nvery surprised, but took it and smiled.\"\n\"What happened to her?\"\n\"I never saw her again on that beach.\" \nHe reminisces\n\"We met one more time - at the university.\"\nHe sighs.\n\"Unfortunately for me, she was already\nmarried.\"\n\"Sorry to hear that.\"\n\"She visited me a few months ago, gave\nme the flask - it was cat medicine she'd\nbeen researching. She thanked me for\ninspiring her to do research. The gem\nmust have been hidden inside the bottle,\nstrange. I never noticed it when I helped \nthis old wounded cat the other day.\"\nHe pauses. \"She must have kept it all \nthose years...\"\n\nA trace of a tear appears in the corner\nof his eye, and his face seems to have \ngained a child-like joy.\n\"A-ha!\" he exlaims.\n\"It must be about the shape!\"\n\nHe pockets the eyeglass and the stone,\ngoes back to his desk and starts shaping\nthe stone he left there. After a few \nminutes he arrives at a round shape, and \ndrops it into a funnel on one side of the\nmachine. After a series of clunks and\nhisses, a golden orb comes out on the \nother end.\n\"Here you go, my child\" he says as he\ngives it to you.\n[maybe charge her to deliver it to queen?]\n","\n"),string$Mnsplit("You say goodbye and walk down the forest path\nenjoying the sun filtered by the gentle rustle\nof leaves.\n\nThe path ends, and the animals swarm out and\nscatter. You're alone now, thirsty, but you get\nan eerie feeling like you're being observed.\nYou don't think you can make it back through\nthe path before sun goes down. You decide to\nfollow the animals to where you think they went\nto. They should at least know where water is,\nright?\n\nYou can smell smoke, that reminds you of the\ntime when you put marshmellow-filled biscuits\nin the oven and forgot - except more pleasant.\n\nYou follow, and eventually can see a lake, and\na bus parked near it. As you advance you\nrealize the bus has been long out of function.\nAt least its original one. It's painted in\ngreen, orange, and purple. You think that\nsomeone very creative must have painted it.\nThere are some bushes with berries on the \nsides of it, and trees with fruit growing on\nthem. You decide to take a gander inside the\nbus, as the door is wide open. There is old\nbut fanciful furniture inside with comfy pillows\nof different shapes and colors. Some plants\nare potted inside, which is a nice touch, and\nit feels like the bus was claimed by nature\nin a way. Nobody's home.\n\nYou turn toward the lake, and you see the same\nswarm of animals you think you saw before,\nracing toward a faint glow in the distance.\nYou come closer and can now see someone with\ntheir back turned to you, sitting in a little\nchair next to a campfire by the lake shore.\nThe animals seem to be flocking around, attracted\nnot only by the warmth, but an air of generosity\nof the person feeding them out of her hand. This\nmust be where the smoky smell of food is coming\nfrom. \n\nYou approach and are greeted by a bright smile\nof a lady with pink hair. One of her eyes is red,\nand the other is blue. \n\"I'm Jeannie. What's yourname little imp?\" \n\"I'm Pat\"\n\"Nice to meet you Pat. Come, sit down.\"\n\nYou sit down next to her and you have a snack\nand something to drink. Jeannie gives you a\nblanket to keep you warm, and you watch the\nsun set over the trees at the other end of\nthe lake.\n\"What do you do here, Jeannie?\" She takes a \nsip out of a bottle.\n\"I take care of the animals here, and they care\nfor me. I give them food, and shelter. I pick up\nthe trash people leave, and sometimes turn it\ninto furniture\"\nYou can see that a little table beside is made\nof different kinds of materials. You notice an\nexpression of sadness in Jeannie's face as she\ntends to the fire. You are impressed by the skill\nshe handles the fire though.\n\"How did you make this fire?\"\n\"I collected some dry grass, small sticks and firewood from the forest\"\n\"I then used a mirror, to reflect the sunlight onto the dry grass.\"\n\n\"Why are you sad?\"\nShe thinks for a minute without revealing\nany emotion, then a smile comes back.\n\"There was this one guy... Let's call him\nJack of Clubs. He could always make me laugh,\nand he used to come here often. He had these\ngreat ideas and plans, but never finished any\nof them. Never left me a note or anything.\nThen there was this other one that I hoped\nwould hang out a little longer. He told me\neverything I needed to hear to feel loved\nand cared for. Maybe a little more than I\nshould have believed in. We did great things\ntogether. Then one day I turned and there was\na diamond on my pillow. No note either.\"\n\"Jack of Diamonds?\"\n\"Bingo\"\nYou hear a little rustle in the darkness, you\nturn toward it, but can't see anything\n\"What's your story?\"\n\"I was flying in the sky, and then I landed\non a desert with all those portals that led\ninto different time periods. There was a man\nwho had a great business idea... \nHe just didnt't know it at the time.\"\nJeannie giggles.\n\"Then I arrived at the port on this island here,\na cat led me to a home at the edge of the forest.\nA wise old man lived there. I came in, fell down,\nbroke a bottle, but I was okay. And it was okay.\nHe gave me a present.\"\n\"Is that so?\"\nYou nod, and take out the golden orb and put it\non the table with a little thud. You could swear\nyou could hear a rustle again, from the direction\nof nothing but pitch black.\n\"Okay, I think it's bed time for me, Pat\"\nYou feel tired too, and can't remember where\nyour bed was.\n\"There's a very comfortable seat for you to sleep\non in the bus.\" Says Jeannie.\n\nYou wake up, and see Jeannie fast asleep. You feel\nrestless though, and wish to continue your adventure.\nYou take a piece of paper out of a stack, and a pen\nand go back to the campfire. Where there was fire \nyesterday you can now see embers, and the forest\ncreatures are all gone. You gather some small sticks\nand cattail fluff for a while, and put it next to the\nfirepit. A brisk wind is coming from the lake. \nYou wrap yourself in a blanket, sit down, and write:\n\n\"Dear Jeannie,\n\nThank you - the seat was comfortable. We forgot\nto put out the fire, but at least you don't need\nsparks for the cattail fluff. I hope the animals\nreturn once you bring the fire back to life.\n\nYour friend, Pat\"\n\nYou put the letter under the orb, so that the wind\ndoesn't blow it away, and leave through a path you\nnever noticed yesterday.\n","\n"),string$Mnsplit("It's a beautiful morning, and the forest feels comforting again. The birds\nare signing, there's a parrot squawk, you can hear some unspecified mammal sounds,\nand the butterflies seem to have decided to accompany you for a while. \nA silhouette of something resembling a palace or a castle emerges through\nthe clearing in the distance.\n\nThe serenity is suddenly broken by the good old rustling behind you\n'That's it!' You think, angrily.\n\"Show yourself!\" You scream as you turn around toward the rascal with your\nteeth and fists clenched.\n\nThe rustling stops, and you were about to walk away, but it resumes, and\nyou can see a dark hooded figure stepping out of the brush. He seems mildly\nembarrassed.\n\n\"What do you want?!\"\n\nThe rogue approaches gingerly, scaling you up as his feet find his way\ndown the narrow path. He stops at a safe distance, you can now see his\nyoung and slightly concerned face. Than takes something out of his pocket\nand tosses it toward you on the path looking at you expectantly. It's the \norb you left at Jeannie's!\n\"You forgot something\" He says - to your surprise. You pick the orb up,\nand look back at the young man, curious. He smirks, and as he turns away\nhis cape flutters. You're puzzled. He glances through the shoulder and shouts\n\"By the way, Jeannie says thanks\"\n","\n"),string$Mnsplit("You venture forth deeper into the forest, enjoying the weather, the views\nand the air cooled off by the shade cast by the trees above you.\n\nFinally, you arrive at a bridge that leads to the palace courtyard.\nThere's a line of solidiers along the walkway to the palace enterance.\n\nTheir serious expressions make you hesitate for a moment, and you\ncan hear a growl in your stomache. You're hungry. As you look around\nyou notice a house with a \"Cuisine\" sign on top of the door. You're not\nsure what it means but you're hoping it has something to do with the\nsmell of food coming from that direction.\n\nYou come in, to a large room, a chef is immersed in a task, jumping around the pot,\nmumbling something. Disapproval. Taste. Approval. He has a tall white hat pleated at the top.\n\nHe turns around to you as you approach.\n\n\"Ah, you must be the new chef the partie.\" You're not sure, and you don't feel like\nhaving a party right now, but you accept the invitation.\n\"Yes\"\n\nHe browses a wardrobe for a moment, and says.\n\"Yes, zis one will be exquisite\"\nHe hands you over a hat, not a party hat - it' similar to his, except smaller.\nYou wear the hat.\n\"Today we'll be making crepes! Have you made crepes before?\"\n\"No\"\n\"Not to worry, I'll teach you. Come\"\nHe puts a recipie in front of you. As you read the ingriedient list,\nhe gathers the required items in front of you. As he shows\n\n\"Get a large bowl ready. Crack sree eggz into ze bowl.\"\nYou mimic the motions.\nAdd two ceups and two tablespoons of flour into ze bowl, \npour in a ceup of meelk and a ceup of water, add four tablepoons\nof oil and a pinch of salt.\nMeex for a few minutes until ze meexteure iz smooz\nMelt between a fifs or a quarter of butter on very low eet\nat ze sem time eet eup a non-steek pan to medium eet.\nLift ze 'ot pan and brush a leetehl melted butter onto it.\nDrip between ahf or two-serds of a ladle onto ze pan making\ncheur ze leequid distreeboots evenlee.\nPut ze pan back and wait for under a meenute until ze crepe\niz soleed and steam comes out from ze bottom of it\nLift ze pan and flip ze crepe in ze air to ze ozer side\nLay ze pan back on ze stove and cook for about ahf ze time\nyou cooked on ze ozer side until you can see some steam again,\nflip ze pan over a plate to remove ze ready crepe\"\n","\n"),string$Mnsplit("You march in through the large door that\nopened itself in front of you. On the \nthrone sits a beautiful lady. She seems\nto be enjoying the conversation with the\ncourtiers, but immediately turns your face\ntowards you as soon as you enter, and all\nthe lively chatter stops at once.\n\"You there!\" She says softly, and treats\nyou with the most kind of smiles you've ever\nseen. As if she were still a child deep down\nin her heart.\n\"It's very brave of you to have come here\nall by yourself\"\n\"It wasn't all that scary\" It kind of was,\nbut you are feeling encouraged.\n\"I've been waiting for you for a long time\"\n\"How so?\"\n\"Let's just say you've made an impact\nwithout even knowing it.\"\n\"This is a really pretty palace\"\nThe crowd seem to approve with cheerful\ngiggles here and there.\nThey offer you some of the most delicious \nfood you've ever eaten.\n\"A little bird told me you'll be coming.\"\nA little bird lands on her shoulder indeed.\nThat must be him.\n\"I have a gift for you\" The courtiers pass\na box from to another from the back of the\nhall, all the way to the dame. She opens the\nbox, and there's a pair of keys linked together\nin it. She gestures at you to come closer, and\nyou do with hesitation.\n\"You can come here whenever you want. All you \nhave to do is close your eyes and think of\nthis palace here.\"\n\"Thank you.\" You take the keys.\n\nYou strut out of the palace proudly, and as\nyou gather your thoughts before another take\noff, you decide to stroll into the garden.\nYou sit down for a bit, enjoying the weather,\nand finding comfort in the ambience of the\nlush surroundings. You are trying to make sense\nout of all of what happened today. Some time\npasses. A crow lands down on the side of the\nbench and asks.\n\"What's the matter, child?\" He has a distinct\nrolling 'r' as if trying to contain a tongue\nlonger than his disproportionally large beak.\n\"I just received keys to the palace, and I\ndon't know why\" you look at the floor tiles\nin front of you.\n\"Perhaps a little *reminder*, I shall bestow\nupon you, shan't I?\"\n\"What?\" you turn quickly toward the crow, but\nhe doesn't seem to have any intention of\nanswering. Instead, he starts turning his\nhead in circles in your general direction,\nas if casting a spell on you.\n*Poof*, you turn into a frog. Right at this\nsecond, a cook appears between you and the\npath back to the palace.\n\n\"Ah, mon petite grenouille, zere you are!\"\nexlaims the cook, and starts pacing toward\nyou with a cleaver raised.\n\"You may want to start rrrunning\". Suggests\nthe crow, and while you couldn't agree more,\nyou realize your legs are not particularly\nwell suited for the task at hand. That being\nsaid, you decide you'd still like to keep them. \nYou start hopping as fast as you can, but the\nmonster is unfailingly closing the gap behind\nyou. You leap into a hedge maze, as you try to\ncling onto your dear life.\n\n[maze puzzle - there is no exit out of it, just\na final destination? there's a bridge at the\nend of the maze that leads toward the courtyard.\nThe monster catches up on the bridge, as there\nare no turns anymore. perhaps slower on turns,\nso you could make up distance\n\nYou see Red jumping out of the bushes, meaowing\nat you with worry but happy that she can see you.\nShe's on the other side of the river. You think\nof anything that could help you defeat the beast,\nand you wished the game gave you more items to\ninteract with than just a set of keys and a golden\norb. In an act of desperation throw the golden orb\nin front of the chef. The monster has finally\ncaught on, and you know you're it. There's only\nthat little orb between you and him. As there's\nno protection anymore. You hope, remembering\nwhat the final words spoken to you at the castle\nwere, and close your eyes. You're scared out of\nyour mind as you wait for the inevitable. You\nsuddenly hear the monster roar, but not in anger -\n- it's fear! You hear a loud thud, and a thunderous\nimpact propagates through the ground, followed by\na loud meaow, and a splash of water. Somehow you\nfeel safe to open your eyes...\n","\n"),string$Mnsplit("You open your eyes slowly, and you realize\nyou're in bed. You were asleep!\nYou can smell a familiar fragrance.\nIt's unmistakenly blueberry muffins.\nYour head hurts.\n\nYou lift your gaze, blurry, still half-\n-trapped between sleep and waking, and you\ncan see your mom and dad. Your mom has\na colored shawl on her neck, with a sequence\nof small circles of various colors, all\njumbled up and embedded in it.\n\nThis place looks familiar. It's your bedroom!\n\nYour parents are very happy to see you you, as\nif they haven't seen you for ages. You try to\nspeak and it's so exerting that you raise in\nthe bed only slightly, but fall back to the\ncomfort of your bed with a tired moan.\n\"That's okay sweetie. It takes time to recover.\"\nSays your mom soothingly.\n\nYou see tears of joy in their eyes as they\nhuddle together. You notice a boy with red\nhair standing on the side of the bed.\n\"This is Red\" Your mom points at him.\n\"He found you and your bike next to the road.\"\nHe seems unmoved by the entire kerfuffle,\nenthusiastically juggling a small golden\nfootball. He stops as your gazes meet, puts\nthe ball under his arm, and brings a plate\nof muffins over to you.\n\"Here, my mom made these.\"\n","\n"));
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
var render = (()=>{return ((canvas)=>{return ((ctx)=>{return (()=>{canvas.width=$Mn(window.innerWidth,20);canvas.height=$Mn(window.innerHeight,20);ctx.font="26px californian";return ((base)=>{(($Gt(current$Mnchapter,0))===false?undefined:((()=>{ctx.fillText("🠜",left$Mnmargin,$Mn(base,vertical$Mnscroll));backarrow$Mnleft=$Mn(left$Mnmargin,10);backarrow$Mntop=$Mn(base,vertical$Mnscroll,10);((arrow)=>{backarrow$Mnwidth=$Pl(arrow.width,20);return backarrow$Mnheight=$Pl(arrow.emHeightAscent,20);})(ctx.measureText("🠜"));return base=$Pl(base,line$Mnheight);})()));for$Mneach(((line)=>{ctx.fillText(line,left$Mnmargin,$Mn(base,vertical$Mnscroll));return base=$Pl(base,line$Mnheight);}),list$Mnref(chapters,current$Mnchapter));(($Ls(current$Mnchapter,$Mn(length(chapters),1)))===false?undefined:((()=>{ctx.fillText("🠞",$St(4,left$Mnmargin),$Mn(base,vertical$Mnscroll));nextarrow$Mnleft=$Mn($St(4,left$Mnmargin),10);nextarrow$Mntop=$Mn(base,vertical$Mnscroll,10);((arrow)=>{nextarrow$Mnwidth=$Pl(arrow.width,20);return nextarrow$Mnheight=$Pl(arrow.emHeightAscent,20);})(ctx.measureText("🠞"));return base=$Pl(base,line$Mnheight);})()));return content$Mnheight=$Pl(base,line$Mnheight,top$Mnmargin);})(top$Mnmargin);})();})(canvas.getContext("2d"));})(document.getElementById("canvas"));});
window.addEventListener("resize",render);
window.addEventListener("load",render);
window.addEventListener("click",((event)=>{writeln(cons({symbol: "next"},cons(cons(nextarrow$Mnleft,cons(event.x,cons(nextarrow$Mnwidth,[]))),cons(cons(nextarrow$Mntop,cons(event.y,cons(nextarrow$Mnheight,[]))),cons((($Ls$Eq(nextarrow$Mnleft,event.x,$Pl(nextarrow$Mnleft,nextarrow$Mnwidth)))===false?(false):($Ls$Eq(nextarrow$Mntop,event.y,$Pl(nextarrow$Mntop,nextarrow$Mnheight)))),[])))));writeln(cons({symbol: "back"},cons(cons(backarrow$Mnleft,cons(event.x,cons(backarrow$Mnwidth,[]))),cons(cons(backarrow$Mntop,cons(event.y,cons(backarrow$Mnheight,[]))),cons((($Ls$Eq(backarrow$Mnleft,event.x,$Pl(backarrow$Mnleft,backarrow$Mnwidth)))===false?(false):($Ls$Eq(backarrow$Mntop,event.y,$Pl(backarrow$Mntop,backarrow$Mnheight)))),[])))));return (((($Ls$Eq(nextarrow$Mnleft,event.x,$Pl(nextarrow$Mnleft,nextarrow$Mnwidth)))===false?(false):((($Ls$Eq(nextarrow$Mntop,event.y,$Pl(nextarrow$Mntop,nextarrow$Mnheight)))===false?(false):($Ls($Pl(current$Mnchapter,1),length(chapters)))))))===false?((((($Ls$Eq(backarrow$Mnleft,event.x,$Pl(backarrow$Mnleft,backarrow$Mnwidth)))===false?(false):((($Ls$Eq(backarrow$Mntop,event.y,$Pl(backarrow$Mntop,backarrow$Mnheight)))===false?(false):($Gt$Eq($Mn(current$Mnchapter,1),0))))))===false?undefined:((()=>{current$Mnchapter=$Mn(current$Mnchapter,1);vertical$Mnscroll=0;return render();})()))):((()=>{current$Mnchapter=$Pl(current$Mnchapter,1);vertical$Mnscroll=0;return render();})()));}));
document.addEventListener("wheel",((event)=>{vertical$Mnscroll=max($Mn(top$Mnmargin),min($Mn(content$Mnheight,window.innerHeight),$Mn(vertical$Mnscroll,event.wheelDeltaY)));return render();}));
