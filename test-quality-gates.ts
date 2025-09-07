// Test file with intentional quality issues for demonstration
import React from 'react';

// TypeScript issues
function badFunction(data) { // implicit any
  console.log(data); // console statement
  let shouldBeConst = "never changes"; // should be const
  var oldStyleVar = 42; // should use let/const
  
  // Unused variable
  let unusedVar = "not used";
  
  // Missing return type
  return data.map(item => {
    if (item.value) {
      return item.value * 2
    }
  })
}

// Security issue simulation  
function potentialXSS(userInput: string) {
  document.innerHTML = userInput; // potential XSS
}

// Performance issue
const ExpensiveComponent = () => {
  // Missing dependency in useEffect (would cause issues)
  const [data, setData] = React.useState();
  
  React.useEffect(() => {
    // expensive operation without proper deps
    fetchData();
  }); // missing dependency array
  
  return <div>Test</div>;
}

export default badFunction;