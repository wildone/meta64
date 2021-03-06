console.log("running module: RenameNodeDlg.js");

namespace m64 {
    export class RenameNodeDlg extends DialogBase {
        constructor() {
            super("RenameNodeDlg");
        }

        /*
         * Returns a string that is the HTML content of the dialog
         */
        build = (): string => {
            var header = this.makeHeader("Rename Node");

            var curNodeNameDisplay = "<h3 id='" + this.id("curNodeNameDisplay") + "'></h3>";
            var curNodePathDisplay = "<h4 class='path-display' id='" + this.id("curNodePathDisplay") + "'></h4>";

            var formControls = this.makeEditField("Enter new name for the node", "newNodeNameEditField");

            var renameNodeButton = this.makeCloseButton("Rename", "renameNodeButton", this.renameNode, this);
            var backButton = this.makeCloseButton("Close", "cancelRenameNodeButton");
            var buttonBar = render.centeredButtonBar(renameNodeButton + backButton);

            return header + curNodeNameDisplay + curNodePathDisplay + formControls + buttonBar;
        }

        renameNode = (): void => {
            var newName = this.getInputVal("newNodeNameEditField");

            if (util.emptyString(newName)) {
                (new MessageDlg("Please enter a new node name.")).open();
                return;
            }

            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                (new MessageDlg("Select a node to rename.")).open();
                return;
            }

            /* if no node below this node, returns null */
            var nodeBelow = edit.getNodeBelow(highlightNode);

            var renamingRootNode = (highlightNode.id === meta64.currentNodeId);

            var thiz = this;
            util.json<json.RenameNodeRequest, json.RenameNodeResponse>("renameNode", {
                "nodeId": highlightNode.id,
                "newName": newName
            }, function(res: json.RenameNodeResponse) {
                thiz.renameNodeResponse(res, renamingRootNode);
            });
        }

        renameNodeResponse = (res: json.RenameNodeResponse, renamingPageRoot: boolean): void => {
            if (util.checkSuccess("Rename node", res)) {
                if (renamingPageRoot) {
                    view.refreshTree(res.newId, true);
                } else {
                    view.refreshTree(null, false, res.newId);
                }
                // meta64.selectTab("mainTabName");
            }
        }

        init = (): void => {
            var highlightNode = meta64.getHighlightedNode();
            if (!highlightNode) {
                return;
            }
            $("#" + this.id("curNodeNameDisplay")).html("Name: " + highlightNode.name);
            $("#" + this.id("curNodePathDisplay")).html("Path: " + highlightNode.path);
        }
    }
}
