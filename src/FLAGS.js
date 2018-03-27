/**********************************************
 *                                            *
 *  all different flags that are needed for   *
 *  maintaining scope info                    *
 *                                            *
 **********************************************/

module.exports = class {
    constructor() {
        this.ANONYMOUS_FUNCTION_DEF = false;
        this.CAPTURE_PARAMS = false;
        this.CLASS_CONSTRUCTOR_DEF = false;
        this.CLASS_SCOPE = false;
        this.COMMENT_ON = false;
        this.DOCANIZE_FLAG_CAPTURED = false;
        this.ENTITY_OPEN = false;
        this.ENTITY_PARAMS_CAPTURED = false;
        this.EXTENDS = {
            super: null
        };
        this.FUNCTION_SCOPE = false;
        this.GIVEN_DEF = false;
        this.KEEP_SCOPE = false;
        this.MAKE_ENTITY = false;
        this.METHOD_SCOPE = false;
        this.MULTI_LINE_DESCRIPTION = false;
        this.NEW_FLAGS = false;
        this.PREVIOUS_COMMENT = false;
        this.PREVIOUS_COMMENT_START = null;
        this.PREVIOUS_COMMENT_END = null;
        this.RETURN_VAL = false;
        this.SINGLE_LINE_DESCRIPTION = false;
        this.USER_DESCRIPTION_CAPTURED = false;
    }
}