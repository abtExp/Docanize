/**
 * all different flags that are needed for maintaining scope info
 * 
 */

// Specifies the number of new lines between two comment lines
let LINE_GAP = 1;

// Specifies whether to generate comment for constructors or not
let CLASS_CONSTRUCTOR_DEF = false;

/**
 * Set to true when an entity is triggered at any line to maintain 
 * scope info for next lines
 */
let SCOPE_ON = false;

// Specifies that open scope is class scope
let CLASS_SCOPE = false;

// Specifies the encountered entity is method or not (checking CLASS_SCOPE)
let METHOD_SCOPE = false;

// Specifies the open scope as function scope
let FUNCTION_SCOPE = false;

// Specifies whether the open entity returns a value or not
let RETURN_VAL = false;

// Flag for whether to generate comments for anonymous flags
let ANONYMOUS_FUNCTION_DEF = false;

/**
 * Whether The user has specified a description for given entity
 * user can write a comment like :
 * // @docanize @entity/@subentity --description : 'description'
 * 
 * above the entities to give descriptions of the entities
 * the description flag is one of the available flags and is used
 * to give some description of the entity.
 * 
 * Other available flags are : -type|-comment|
 */
let GIVEN_DEF = false;

let DESCRIPTION_ON = false;

let COMMENT_ON = false;

let EXTENDS = {
    super: null
}

let SINGLE_LINE_DESCRIPTION = false;

let MULTI_LINE_DESCRIPTION = false;

let DOCANIZE_FLAG_CAPTURED = false;

let USER_DESCRIPTION_CAPTURED = false;

let MAKE_ENTITY = false;

module.exports = {
    LINE_GAP,
    CLASS_CONSTRUCTOR_DEF,
    ANONYMOUS_FUNCTION_DEF,
    SCOPE_ON,
    CLASS_SCOPE,
    IS_METHOD,
    FUNCTION_SCOPE,
    RETURN_VAL,
    GIVEN_DEF,
    COMMENT_ON,
    EXTENDS,
    SINGLE_LINE_DESCRIPTION,
    MULTI_LINE_DESCRIPTION,
    DOCANIZE_FLAG_CAPTURED,
    USER_DESCRIPTION_CAPTURED,
    MAKE_ENTITY
}