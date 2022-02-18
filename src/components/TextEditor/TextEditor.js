import React from "react";
import ReactDOM from 'react-dom';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonButton } from '@ionic/react';
import { listOutline } from 'ionicons/icons';
import BoldIcon from './icons/bold';
import UnorderedListIcon from './icons/ul';
import HeadingIcon from './icons/heading';
import QuoteIcon from './icons/quote';
import OlIcon from './icons/ol';
import ItalicIcon from './icons/italic';
import UnderlineIcon from './icons/underline';
import { stateToHTML } from "draft-js-export-html";

import 'draft-js/dist/Draft.css';

import './TextEditor.scss';


class TextEditor extends React.Component {

  constructor(props:any) {
	super(props);
	this.state = {
		editorState: EditorState.createEmpty(),
		initialTextLoaded: false,
	};

	this.placeholder = props.placeholder;

	this.inputRef = React.createRef();

	this.focus = () => this.inputRef.current.focus();
	this.onChange = (editorState) => {
		this.setState({editorState})
		// props.setTextEditorText({editorState});

		props.setTextEditorText( editorState.getCurrentContent() );
	};

	this.handleKeyCommand = (command) => this._handleKeyCommand(command);
	this.handleReturn = (command) => this._handleReturn(command);
	this.onTab = (e) => this._onTab(e);
	this.toggleBlockType = (type) => this._toggleBlockType(type);
	this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
	
  }
  

  componentDidUpdate(prevProps) {

	if ( prevProps.initialText !== this.props.initialText && !this.state.initialTextLoaded ) {

		this.setState({
			editorState: EditorState.createWithContent( this.props.initialText ),
			initialTextLoaded: true
		  });
	
	}
  }

  


  _handleReturn(command) {
    const { editorState } = this.state;
    if (command.shiftKey) {
      
		//console.log(editorState);
		
		this.setState({ editorState: RichUtils.insertSoftNewline(editorState) });
	  
	  
      return 'handled';
    }
    return 'not-handled';
  }

  _handleKeyCommand(command) {

	const {editorState} = this.state;
	const newState = RichUtils.handleKeyCommand(editorState, command);
	if (newState) {
	  this.onChange(newState);
	  return true;
	}
	return false;
  }

  _onTab(e) {
	const maxDepth = 4;
	this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
	this.onChange(
	  RichUtils.toggleBlockType(
		this.state.editorState,
		blockType
	  )
	);
  }

  _toggleInlineStyle(inlineStyle) {
	this.onChange(
	  RichUtils.toggleInlineStyle(
		this.state.editorState,
		inlineStyle
	  )
	);
  }

  


  render() {
	const { editorState } = this.state;

	// If the user changes block type before entering any text, we can
	// either style the placeholder or hide it. Let's just hide it now.
	let className = 'RichEditor-editor';
	var contentState = editorState.getCurrentContent();
	if (!contentState.hasText()) {
	  if (contentState.getBlockMap().first().getType() !== 'unstyled') {
		className += ' RichEditor-hidePlaceholder';
	  }
	}

	

	// console.log(this.props.textEditorText);

	return (
		<div className="text-editor-wrap">
	  <div className="RichEditor-root">
		<HeadingStyleControls
		  editorState={editorState}
		  onToggle={this.toggleBlockType}
		/>
		<InlineStyleControls
		  editorState={editorState}
		  onToggle={this.toggleInlineStyle}
		/>
		<BlockStyleControls
		  editorState={editorState}
		  onToggle={this.toggleBlockType}
		/>
		
		
		<div className={className} onClick={this.focus}>
		  <Editor
			autoCapitalize="on"
			autoCorrect="on"
			blockStyleFn={getBlockStyle}
			customStyleMap={styleMap}
			handleReturn={this.handleReturn}
			editorState={editorState}
			handleKeyCommand={this.handleKeyCommand}
			onChange={this.onChange}
			onTab={this.onTab}
			placeholder={this.placeholder}
			ref={this.inputRef}
			spellCheck={true}
		  />
		</div>
	  </div>
	  </div>
	);
  }

  
}



// Custom overrides for "code" style.
const styleMap = {
  CODE: {
	backgroundColor: 'rgba(0, 0, 0, 0.05)',
	fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
	fontSize: 16,
	padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
	case 'blockquote': return 'RichEditor-blockquote';
	default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
	super();
	this.onToggle = (e) => {
	  e.preventDefault();
	  this.props.onToggle(this.props.style);
	};
  }

  render() {
	let className = 'RichEditor-styleButton';
	if (this.props.active) {
	  className += ' RichEditor-activeButton';
	}

	return (
	  <span className={className} onMouseDown={this.onToggle}>
		{this.props.icon ? this.props.icon : this.props.label}
	  </span>
	);
  }
}

const BLOCK_TYPES = [
//   {label: 'H1', style: 'header-one'},
//   {label: 'Heading 1', style: 'header-two', icon: <HeadingIcon />},
//   {label: 'Heading 2', style: 'header-three'},
//   {label: 'H4', style: 'header-four'},
//   {label: 'H5', style: 'header-five'},
//   {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote', icon: <QuoteIcon />},
  {label: 'UL', style: 'unordered-list-item', icon: <UnorderedListIcon />},
  {label: 'OL', style: 'ordered-list-item', icon: <OlIcon />},
//   {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType();

  return (
	<div className="RichEditor-controls">
	  {BLOCK_TYPES.map((type) =>
		<StyleButton
		  key={type.label}
		  active={type.style === blockType}
		  label={type.label}
		  onToggle={props.onToggle}
		  style={type.style}
		  icon={type.icon}
		/>
	  )}
	</div>
  );
};

const HEADING_TYPES = [
	//   {label: 'H1', style: 'header-one'},
	  {label: 'Heading 1', style: 'header-two', icon: <HeadingIcon />},
	//   {label: 'Heading 2', style: 'header-three'},
	//   {label: 'H4', style: 'header-four'},
	//   {label: 'H5', style: 'header-five'},
	//   {label: 'H6', style: 'header-six'},
	//   {label: 'Blockquote', style: 'blockquote', icon: <QuoteIcon />},
	//   {label: 'UL', style: 'unordered-list-item', icon: <UnorderedListIcon />},
	//   {label: 'OL', style: 'ordered-list-item', icon: <OlIcon />},
	//   {label: 'Code Block', style: 'code-block'},
	];

const HeadingStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
	.getCurrentContent()
	.getBlockForKey(selection.getStartKey())
	.getType();

  return (
	<div className="RichEditor-controls">
	  {HEADING_TYPES.map((type) =>
		<StyleButton
		  key={type.label}
		  active={type.style === blockType}
		  label={type.label}
		  onToggle={props.onToggle}
		  style={type.style}
		  icon={type.icon}
		/>
	  )}
	</div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD', icon: <BoldIcon />},
  {label: 'Italic', style: 'ITALIC', icon: <ItalicIcon />},
  {label: 'Underline', style: 'UNDERLINE', icon: <UnderlineIcon />},
//   {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
	<div className="RichEditor-controls">
	  {INLINE_STYLES.map(type =>
		<StyleButton
		  key={type.label}
		  active={currentStyle.has(type.style)}
		  label={type.label}
		  onToggle={props.onToggle}
		  style={type.style}
		  icon={type.icon}
		/>
	  )}
	</div>
  );
};


export default TextEditor;