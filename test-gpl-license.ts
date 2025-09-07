// Test file with GPL license usage (should be blocked in enterprise context)

/*
 * This file uses GPL-licensed code which conflicts with proprietary/commercial usage
 * Quality Gates should detect and block this
 */

// Simulated GPL-licensed dependency
import { someGplFunction } from 'gpl-licensed-package'; // GPL v3 license

/**
 * This code is derived from GPL v3 licensed software
 * Copyright (C) 2024 GPL Project
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
function gplDerivedCode() {
  // Code that would violate GPL license terms in commercial usage
  return someGplFunction();
}

// Another GPL reference
const GPL_NOTICE = `
  This software contains GPL v3 licensed components.
  Commercial usage may require license compliance review.
`;

export { gplDerivedCode, GPL_NOTICE };