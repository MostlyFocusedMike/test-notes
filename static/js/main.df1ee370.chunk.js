(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[,,,,,,,,,,,function(e,t,n){"use strict";var a=n(2),i=n(3),o="http://localhost:8100",r=function(){function e(){Object(a.a)(this,e)}return Object(i.a)(e,null,[{key:"getOne",value:function(e){return fetch("".concat(o,"/notes/").concat(e)).then(function(e){return e.json()})}},{key:"create",value:function(e){var t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)};return fetch("".concat(o,"/notes"),t).then(function(e){return e.json()}).catch(console.log)}},{key:"update",value:function(e){var t={method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)};return console.log("Note in update:",e),fetch("".concat(o,"/notes/").concat(e.title),t).then(function(e){return e.json()})}},{key:"reload",value:function(e){return fetch("".concat(o,"/reload"),{method:"PUT"}).then(function(e){return e.text()})}}]),e}();t.a=r},,,,,,,,,function(e,t,n){"use strict";(function(e){var a=n(2),i=n(3),o=n(6),r=n(5),l=n(7),c=n(0),s=n.n(c),u=n(21),h=(n(35),n(24)),d=n(23),m=function(e){function t(){var e;return Object(a.a)(this,t),(e=Object(o.a)(this,Object(r.a)(t).call(this))).toggleEdit=function(){e.setState(function(e){return{editing:!e.editing}})},e.initState={editing:!1,local:!1},e.state=e.initState,e}return Object(l.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){window.location.href.match("//localhost:")&&(console.log("hello",window.location.href),this.setState({local:!0,editing:!0}))}},{key:"render",value:function(){return s.a.createElement("div",{className:"App"},s.a.createElement(h.a,{viewInfo:this.state}),s.a.createElement(d.a,{viewInfo:this.state,toggleEdit:this.toggleEdit}))}}]),t}(s.a.Component);t.a=Object(u.hot)(e)(m)}).call(this,n(33)(e))},,,function(e,t,n){"use strict";var a=n(0),i=n.n(a),o=n(49),r=n(48),l=n(22),c=n(12),s=n(2),u=n(3),h=n(6),d=n(5),m=n(7),f=function(e){function t(){return Object(s.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return i.a.createElement("form",{onChange:this.props.handleChange,onSubmit:this.props.handleSubmit},i.a.createElement("label",{htmlFor:"title"},"title"),i.a.createElement("input",{id:"title",name:"title",type:"text",value:this.props.newNote.title}),i.a.createElement("label",{htmlFor:"text"},"text"),i.a.createElement("textarea",{id:"text",name:"text",value:this.props.newNote.text}),i.a.createElement("button",null,"Save"))}}]),t}(i.a.Component),p=n(14),g=n.n(p),v=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(h.a)(this,Object(d.a)(t).call(this))).state={markdown:""},e}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderWelcome",value:function(){return"# hello there \n ## start adding markdown to get started"}},{key:"render",value:function(){var e=this.props.note,t=e.title,n=e.text||this.renderWelcome(),a=g()(n);return i.a.createElement("div",{id:"md-preview"},i.a.createElement("h1",null,"Preview of: ",t),i.a.createElement("div",{dangerouslySetInnerHTML:{__html:a}}))}}]),t}(i.a.Component),b=function(e){function t(){return Object(s.a)(this,t),Object(h.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"mode-bar"},i.a.createElement("p",null,"Currently in ",this.props.viewInfo.editing?"Editing":"Viewing"," mode"),i.a.createElement("button",{onClick:this.props.toggleEdit},"Toggle"))}}]),t}(i.a.Component),w=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(h.a)(this,Object(d.a)(t).call(this))).initState={sections:[]},e.state=e.initState,e}return Object(m.a)(t,e),Object(u.a)(t,[{key:"loadContents",value:function(){if(this.props.text){var e=g()(this.props.text).match(/<h1.+>.+</g).map(function(e){var t=e.match(/<h1 id="(.+)">(.+)</);return{link:t[1],text:t[2]}});this.setState({sections:e})}}},{key:"componentDidMount",value:function(){this.loadContents()}},{key:"componentDidUpdate",value:function(e){e.text!==this.props.text&&this.loadContents()}},{key:"render",value:function(){return i.a.createElement("div",{id:"table-of-contents"},i.a.createElement("p",null,"Table of contents"),this.state.sections.map(function(e){return i.a.createElement("a",{href:"#".concat(e.link)},e.text)}))}}]),t}(i.a.Component),E=n(11),j=n(50),O=function(e){function t(){var e;return Object(s.a)(this,t),(e=Object(h.a)(this,Object(d.a)(t).call(this))).handleChange=function(t){e.setState(Object(c.a)({},t.target.name,t.target.value))},e.handleSubmit=function(t){t.preventDefault(),console.log("update it"),E.a.update(Object(l.a)({},e.state,{oldTitle:e.props.match.params.fileName})).then(function(){e.props.match.params.fileName||e.setState({redirectNewFile:!0})})},e.initState={title:"",text:"",redirectNewFile:!1,redirectMissingFile:!1},e.state=e.initState,e}return Object(m.a)(t,e),Object(u.a)(t,[{key:"loadFile",value:function(e){var t=this,a=n(41)("./"+e+".md");fetch(a).then(function(e){return e.text()}).then(function(n){t.setState(function(t){return{title:e,text:n}})})}},{key:"componentDidMount",value:function(){console.log("mount");try{this.props.match.params.fileName&&this.loadFile(this.props.match.params.fileName)}catch(e){console.log("couldnt find the file"),this.setState({redirectMissingFile:!0})}}},{key:"componentDidUpdate",value:function(e,t,n){this.props.match.params.fileName!==e.match.params.fileName&&(this.props.match.params.fileName?this.loadFile(this.props.match.params.fileName):this.setState(this.initState)),this.state.redirectMissingFile&&this.setState(this.initState)}},{key:"render",value:function(){return this.state.redirectNewFile?(console.log("redirected new file"),i.a.createElement(j.a,{to:"/notes/".concat(this.state.title)})):this.state.redirectMissingFile?(console.log("redirected missing file"),i.a.createElement(j.a,{to:"/"})):i.a.createElement("div",{className:"note"},this.props.viewInfo.editing?i.a.createElement(f,{handleChange:this.handleChange,handleSubmit:this.handleSubmit,newNote:this.state,viewInfo:this.props.viewInfo,toggleEdit:this.props.toggleEdit}):"",i.a.createElement(v,{note:this.state,viewInfo:this.props.viewInfo}),this.props.viewInfo.editing?"":i.a.createElement(w,{text:this.state.text}),this.props.viewInfo.local?i.a.createElement(b,{viewInfo:this.props.viewInfo,toggleEdit:this.props.toggleEdit}):"")}}]),t}(i.a.Component);t.a=function(e){var t=e.viewInfo,n=e.toggleEdit;return i.a.createElement(o.a,null,i.a.createElement(r.a,{exact:!0,path:"/",render:function(e){return i.a.createElement(O,Object.assign({},e,{viewInfo:t,toggleEdit:n}))}}),i.a.createElement(r.a,{exact:!0,path:"/notes/:fileName",render:function(e){return i.a.createElement(O,Object.assign({},e,{viewInfo:t,toggleEdit:n}))}}),i.a.createElement(r.a,{exact:!0,path:"*",render:function(e){return i.a.createElement(O,Object.assign({},e,{viewInfo:t,toggleEdit:n}))}}))}},function(e,t,n){"use strict";var a=n(2),i=n(3),o=n(6),r=n(5),l=n(7),c=n(0),s=n.n(c),u=n(11),h=n(12),d=n(50),m=function(e){function t(){var e;return Object(a.a)(this,t),(e=Object(o.a)(this,Object(r.a)(t).call(this))).handleChange=function(t){e.setState(Object(h.a)({},t.target.name,t.target.value))},e.sleep=function(e){return new Promise(function(t){return setTimeout(t,e)})},e.handleSubmit=function(t){t.preventDefault(),u.a.create(e.state).then(function(t){t.msg?alert(t.msg):e.sleep(100).then(function(){e.setState({redirectNewFile:!0})})})},e.componentDidUpdate=function(){e.state.redirectNewFile&&e.setState({redirectNewFile:!1})},e.initState={title:"",redirectNewFile:!1},e.state=e.initState,e}return Object(l.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return this.state.redirectNewFile?s.a.createElement(d.a,{to:"/notes/".concat(this.state.title)}):s.a.createElement("div",{id:"new-file-modal"},s.a.createElement("h1",null,"I am the new file modal"),s.a.createElement("form",{onSubmit:this.handleSubmit},s.a.createElement("label",null,"File Name"),s.a.createElement("input",{type:"text",name:"title",onChange:this.handleChange}),s.a.createElement("p",null,"Warning: creating a new file will destroy any unsaved changes. Be sure to save your current file"),s.a.createElement("button",{onClick:this.props.toggleNewFileModal},"Cancel"),s.a.createElement("button",null,"Create")))}}]),t}(s.a.Component),f=n(46),p=function(e){function t(){var e;return Object(a.a)(this,t),(e=Object(o.a)(this,Object(r.a)(t).call(this))).toggleNewFileModal=function(){console.log("hello"),e.setState(function(e){return{isNewFileModalVisibile:!e.isNewFileModalVisibile}})},e.state={files:[],isNewFileModalVisibile:!1},e}return Object(l.a)(t,e),Object(i.a)(t,[{key:"componentWillMount",value:function(){var e=n(40);this.setState({files:e})}},{key:"reload",value:function(){u.a.reload()}},{key:"isEditMode",value:function(){return this.props.viewInfo.editing&&this.props.viewInfo.local}},{key:"render",value:function(){return s.a.createElement("div",{id:"notes-dir"},s.a.createElement("h1",null,"Files"),this.isEditMode()?s.a.createElement("button",{onClick:this.toggleNewFileModal},"New File"):"",this.state.isNewFileModalVisibile?s.a.createElement(m,{toggleNewFileModal:this.toggleNewFileModal}):"",this.state.files.map(function(e,t){return s.a.createElement(f.a,{to:"/notes/".concat(e),key:t},e)}),this.isEditMode()?s.a.createElement("button",{onClick:this.reload},"Reload"):"")}}]),t}(s.a.Component);t.a=p},,function(e,t,n){e.exports=n(45)},,,,,function(e,t,n){},,,,function(e,t,n){},,,,,function(e){e.exports=["hapi-notes","hapi-pal","javascript"]},function(e,t,n){var a={"./hapi-notes.md":42,"./hapi-pal.md":43,"./javascript.md":44};function i(e){var t=o(e);return n(t)}function o(e){var t=a[e];if(!(t+1)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return t}i.keys=function(){return Object.keys(a)},i.resolve=o,e.exports=i,i.id=41},function(e,t,n){e.exports=n.p+"static/media/hapi-notes.4b0294dc.md"},function(e,t,n){e.exports=n.p+"static/media/hapi-pal.9549f239.md"},function(e,t,n){e.exports=n.p+"static/media/javascript.444bcb3a.md"},function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(19),r=n.n(o),l=n(47),c=(n(31),n(20));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(l.a,null,i.a.createElement(c.a,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}],[[26,2,1]]]);
//# sourceMappingURL=main.df1ee370.chunk.js.map