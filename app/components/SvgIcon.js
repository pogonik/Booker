import React, { PropTypes, Component } from 'react';

export default class SvgIcon extends Component {

   static propTypes = {
      viewBox: PropTypes.string,
      size: PropTypes.oneOfType([
         PropTypes.string,
         PropTypes.number
      ]),
      style: PropTypes.object
   };

   static defaultProps = {
      viewBox: "0 0 32 32",
      size: '32'
   };

   state = {
   };

   constructor(props) {
      super(props);
   }

   render() {

      let styles = Object.assign({
         fill: "currentColor",
         verticalAlign: "middle",
         width: this.props.size + 'px',
         height: this.props.size + 'px'
      }, this.props.style);

      return (
         <svg {...this.props} preserveAspectRatio="xMidYMid meet" style={styles}>
            {this.props.children}
         </svg>
      );
   }
}
