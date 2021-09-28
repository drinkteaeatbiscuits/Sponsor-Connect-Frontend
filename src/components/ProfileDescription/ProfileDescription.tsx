import { Fragment } from "react";

interface ContainerProps { 
    fullDescriptionText: any;
}

interface WrapperProps { 
    condition: any;
    wrapper: any;
    children: any;
}

let listArray = new Array;

// WrapperProps.children.forEach((element:any) => {<li>{element.text}</li>})

const ConditionalWrapper: React.FC<WrapperProps> = (WrapperProps) => WrapperProps.condition ? <li>Bullet</li>  : <li>{WrapperProps.children.text} </li>;

const ProfileDescription: React.FC<ContainerProps> = (ContainerProps) => {
  return ( 
    
      <div className="profile-description">

          { ContainerProps.fullDescriptionText && ContainerProps.fullDescriptionText.blocks.map( (block: { text: string; key: any; type: any; }, i: number, array: { type: string; }[]) => 
          {
              
              let newListArray = array.slice(i);

              listArray.length === 0 && newListArray.some((element, index) => {
                  
                 element.type === "unordered-list-item" && listArray.push(element);

                 return newListArray[index + 1].type !== "unordered-list-item";
              });

              

              console.log(listArray);

              return <Fragment key={ block.key }>
              {/* { block.type === "unordered-list-item" && <li key={ block.key }>{ block.text }</li> } */}

              { block.type === "unordered-list-item" && <ConditionalWrapper condition={block.type === "unordered-list-item"} wrapper={(children:any) => <ul>{children}</ul>} children={newListArray}></ConditionalWrapper> }
              
              {/* { block.type === "unordered-list-item" && array[i - 1].type !== "unordered-list-item" && <ul></ul> } */}
              {/* { block.type !== "unordered-list-item" && array[i - 1].type === "unordered-list-item" &&  } */}
          </Fragment>
          }
          
        //   

        //   { block.type === "unordered-list-item" && array[i - 1].type !== "unordered-list-item" && "<ul>" }
          
        //   { block.type === "unordered-list-item" && <li key={ block.key }>{ block.text }</li> }
          
        //   { block.type === "unstyled" && <p key={ block.key }>{ block.text }</p> }
          
        //   { block.type === "header-two" && <h2 key={ block.key }>{ block.text }</h2> }

        //   { block.type !== "unordered-list-item" && array[i - 1].type === "unordered-list-item" && "</ul>" }


        //   
  
          )}
            
          {/* {
          
          


            
          block.type === "unstyled" && <p key={ block.key }> { block.text } </p>
          ||
          block.type === "header-two" && <h2 key={ block.key }> { block.text } </h2>
          ||
          block.type === "unordered-list-item" && array[i - 1].type !== "unordered-list-item" && <ul key={ block.key + "-ul"}><li key={ block.key }>  { block.text } </li></ul>
          ||
          block.type === "unordered-list-item" && <li key={ block.key }>  { block.text } </li>
          ||
          <div key={ block.key }>{ block.text }</div>

            // block.type === "unordered-list-item" && array[i - 1].type !== "unordered-list-item" && <ul></ul> :

            // block.type === "unordered-list-item" ? <li key={ block.key }>  { block.text } </li> :


            // 
            
          )} */}
          
 
          </div>

  );
};

export default ProfileDescription;
