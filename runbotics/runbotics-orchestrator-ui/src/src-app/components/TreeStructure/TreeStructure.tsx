import React, { FC } from 'react';

import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { TreeView } from '@mui/x-tree-view/TreeView';

import CustomTreeItem from './CustomTreeItem';
import { TreeStructureItem, TreeStructureProps } from './TreeStructure.types';

const TreeStructure: FC<TreeStructureProps> = ({ currentNodeChildren, defaultIcon, selected, setSelected, defaultSelected = [], isMultiSelect = false }) => {
    const [expanded, setExpanded] = React.useState<string[]>(Array.isArray(selected) ? selected : []);

    const handleToggle = (_e: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (_e: React.SyntheticEvent, nodeIds: string[]) => {
        setSelected(nodeIds);
    };

    const renderNodes = (node: TreeStructureItem) => (
        <CustomTreeItem
            key={node.id}
            nodeId={node.id}
            labelText={node.name}
            labelIcon={node.icon || defaultIcon}
            $haschildren={Array.isArray(node.children)}
        >
            {Array.isArray(node.children)
                ? node.children.map((childNode) => renderNodes(childNode))
                : null}
        </CustomTreeItem>
    );
    return (
        <TreeView
            aria-label="process-collections-structure"
            defaultCollapseIcon={<ExpandMoreOutlinedIcon />}
            defaultExpandIcon={<ChevronRightOutlinedIcon />}
            sx={{ flexGrow: 1, overflowY: 'auto' }}
            expanded={expanded}
            selected={Array.isArray(selected) && selected.length > 0 ? selected : defaultSelected}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            multiSelect={isMultiSelect}
        >
            {currentNodeChildren.map((childNode) => renderNodes(childNode))}
        </TreeView>
    );
};

export default TreeStructure;
