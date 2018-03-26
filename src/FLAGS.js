/**********************************************
 *                                            *
 *  all different flags that are needed for   *
 *  maintaining scope info                    *
 *                                            *
 **********************************************/

class FLAGS_DEFINE {
    constructor() {
        this.ANONYMOUS_FUNCTION_DEF = false;
        this.CLASS_CONSTRUCTOR_DEF = false;
        this.CLASS_SCOPE = false;
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
        this.RETURN_VAL = false;
        this.SINGLE_LINE_DESCRIPTION = false;
        this.USER_DESCRIPTION_CAPTURED = false;
    }
}

module.exports = FLAGS_DEFINE;