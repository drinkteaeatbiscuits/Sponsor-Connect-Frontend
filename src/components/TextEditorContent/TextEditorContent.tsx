import { constructOutline } from "ionicons/icons";
import React from "react";
import { Fragment } from "react";
import redraft, { createStylesRenderer } from 'redraft';

import './TextEditorContent.scss';

const styleMap = {
    BOLD: {
      fontWeight: 'bold',
    },
    ITALIC: {
      fontStyle: 'italic',
    },
    UNDERLINE: {
      textDecoration: 'underline',
    },
  };

const InlineWrapper = ( element: {children:any, style:any, key:any} ) => { 

    return <span key={(Math.random() + 1).toString(36).substring(7)} style={element.style}>{element.children}</span>;

}

const addBreaklines = (children:any ) => { 
    
    return children.map((child:any, index:any) => {
		
		console.log(child);

	return <p key={(Math.random() + 1).toString(36).substring(7)}>{ [child, <br key={(Math.random() + 1).toString(36).substring(7)} />]}</p>
	
	})

}

// const addBreaklines = (children:any) => children.map((child:any) => [child, <br />]);

// const List = (element:any) => {
//     console.log(element);
//     return <span key={(Math.random() + 1).toString(36).substring(7)} style={element.style}>{element.children}</span>;
// }


const getList = (ordered:any, children:any) => {

    return ordered ? <ol key={(Math.random() + 1).toString(36).substring(7)}>{ children.map((child:any, i:any) => <li key={(Math.random() + 1).toString(36).substring(7)}>{child}</li>) }</ol>
     : <ul key={(Math.random() + 1).toString(36).substring(7)}>{ children.map((child:any, i:any) => <li key={(Math.random() + 1).toString(36).substring(7)}>{child}</li>) }</ul>

};
  


const renderers = {
    styles: createStylesRenderer(InlineWrapper, styleMap),
    
   blocks: {
    // unstyled: (children:any, keys:any ) => { 

    //     // return <p key={(Math.random() + 1).toString(36).substring(7)}>{ addBreaklines(children) }</p>
    //     return addBreaklines(children)
    // },
	unstyled: (children:any) => { 
		// console.log(children); 
		return children.map((child:any) => <p key={(Math.random() + 1).toString(36).substring(7)}>{child}</p>)
	},
    blockquote: (children: { keys:any }) => {
       return <blockquote key={(Math.random() + 1).toString(36).substring(7)}>{addBreaklines(children)}</blockquote>
    },
    'header-one': ( children:any, keys:any ) => children.map((child:any, i:any) => <h1 key={keys.keys[i]}>{child}</h1>),
    'header-two': ( children:any, keys:any ) => children.map((child:any, i:any) => <h2 key={keys.keys[i]}>{child}</h2>),
    'header-three': ( children:any, keys:any ) => children.map((child:any, i:any) => <h3 key={keys.keys[i]}>{child}</h3>),
    'header-four': ( children:any, keys:any ) => children.map((child:any, i:any) => <h4 key={keys.keys[i]}>{child}</h4>),
    'header-five': ( children:any, keys:any ) => children.map((child:any, i:any) => <h5 key={keys.keys[i]}>{child}</h5>),
    'header-six': ( children:any, keys:any ) => children.map((child:any, i:any) => <h6 key={keys.keys[i]}>{child}</h6>),
    'unordered-list-item': ( children:any ) => getList(false, children),
    'ordered-list-item': ( children:any ) => getList(true, children),
    
   }

  };

  const options = {
    cleanup: {
      after: 'all',
      types: 'all',
      split: true,
    },
  };

interface ContainerProps { 
    editorContent: any;
}

const TextEditorContent: React.FC<ContainerProps> = (ContainerProps) => {
  return ( 
    
      <div className="text-editor-content">

         {ContainerProps.editorContent && redraft(ContainerProps.editorContent, renderers, options)}

      </div>

  );
};

export default TextEditorContent;
