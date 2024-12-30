service ChatService @(requires: 'authenticated-user') {

    action question(question : String) returns String;

}
