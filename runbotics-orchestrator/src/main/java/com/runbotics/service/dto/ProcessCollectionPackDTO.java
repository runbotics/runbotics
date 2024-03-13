package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

public class ProcessCollectionPackDTO implements Serializable {

    private List<ProcessCollectionDTO> childrenCollections;

    private List<ProcessCollectionDTO> breadcrumbs;

    public ProcessCollectionPackDTO(List<ProcessCollectionDTO> childrenCollections, List<ProcessCollectionDTO> breadcrumbs) {
        this.childrenCollections = childrenCollections;
        this.breadcrumbs = breadcrumbs;
    }

    public void setChildrenCollections(List<ProcessCollectionDTO> childrenCollections) {
        this.childrenCollections = childrenCollections;
    }

    public List<ProcessCollectionDTO> getChildrenCollections() {
        return this.childrenCollections;
    }

    public void setBreadcrumbs(List<ProcessCollectionDTO> breadcrumbs) {
        this.breadcrumbs = breadcrumbs;
    }

    public List<ProcessCollectionDTO> getBreadcrumbs() {
        return this.breadcrumbs;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessCollectionPackDTO that = (ProcessCollectionPackDTO) o;
        return this.childrenCollections.equals(that.childrenCollections) && this.breadcrumbs.equals(that.breadcrumbs);
    }

    @Override
    public int hashCode() {
        return Objects.hash(childrenCollections, breadcrumbs);
    }

    @Override
    public String toString() {
        return "ProcessCollectionPackDTO{" + "childrenCollections=" + childrenCollections + ", breadcrumbs=" + breadcrumbs + '}';
    }
}
