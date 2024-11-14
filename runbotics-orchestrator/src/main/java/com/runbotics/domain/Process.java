package com.runbotics.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Type;

/**
 * A Process.
 */
@Entity
@Table(name = "process")
public class Process implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "definition")
    private String definition;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "is_attended")
    private Boolean isAttended;

    @Column(name = "is_triggerable")
    private Boolean isTriggerable;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "updated")
    private ZonedDateTime updated;

    @Column(name = "last_run")
    private ZonedDateTime lastRun;

    @Column(name = "execution_info")
    private String executionInfo;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "system", referencedColumnName = "name")
    private BotSystem system;

    @ManyToOne
    @JoinColumn(name = "bot_collection")
    private BotCollection botCollection;

    @ManyToOne
    @JoinColumn(name = "editor_id")
    private User editor;

    @ManyToMany
    @JoinTable(
        name = "tag_process",
        joinColumns = { @JoinColumn(name = "process_id", referencedColumnName = "id") },
        inverseJoinColumns = { @JoinColumn(name = "tag_id", referencedColumnName = "id") }
    )
    @BatchSize(size = 20)
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "process_global_variable",
        joinColumns = @JoinColumn(name = "process_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "global_variable_id", referencedColumnName = "id")
    )
    private Set<GlobalVariable> globalVariables = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "output_type", referencedColumnName = "type")
    private ProcessOutput outputType;

    @ManyToOne
    @JoinColumn(name = "process_collection")
    private ProcessCollection processCollection;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Process id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Process name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Process description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDefinition() {
        return this.definition;
    }

    public Process definition(String definition) {
        this.definition = definition;
        return this;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Boolean getIsPublic() {
        return this.isPublic;
    }

    public Boolean getIsAttended() {
        return this.isAttended;
    }

    public Boolean getIsTriggerable() {
        return this.isTriggerable;
    }

    public Process isPublic(Boolean isPublic) {
        this.isPublic = isPublic;
        return this;
    }

    public Process isAttended(Boolean isAttended) {
        this.isAttended = isAttended;
        return this;
    }

    public Process isTriggerable(Boolean isTriggerable) {
        this.isTriggerable = isTriggerable;
        return this;
    }

    public Process updateGlobalVariables(List<GlobalVariable> globalVariables) {
        this.globalVariables = new HashSet<>(globalVariables);
        return this;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public void setIsAttended(Boolean isAttended) {
        this.isAttended = isAttended;
    }

    public void setIsTriggerable(Boolean isTriggerable) {
        this.isTriggerable = isTriggerable;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public Process created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return this.updated;
    }

    public Process updated(ZonedDateTime updated) {
        this.updated = updated;
        return this;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public String getExecutionInfo() {
        return this.executionInfo;
    }

    public Process executionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
        return this;
    }

    public void setExecutionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
    }

    public User getCreatedBy() {
        return this.createdBy;
    }

    public Process createdBy(User user) {
        this.setCreatedBy(user);
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public Boolean getAttended() {
        return isAttended;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public BotSystem getSystem() {
        return system;
    }

    public void setSystem(BotSystem system) {
        this.system = system;
    }

    public BotCollection getBotCollection() {
        return botCollection;
    }

    public void setBotCollection(BotCollection botCollection) {
        this.botCollection = botCollection;
    }

    public ZonedDateTime getLastRun() {
        return lastRun;
    }

    public void setLastRun(ZonedDateTime lastRun) {
        this.lastRun = lastRun;
    }

    public User getEditor() {
        return editor;
    }

    public Process editor(User user) {
        this.setEditor(user);
        return this;
    }

    public void setEditor(User user) {
        this.editor = user;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Set<GlobalVariable> getGlobalVariables() {
        return this.globalVariables;
    }

    public void setGlobalVariables(Set<GlobalVariable> globalVariables) {
        this.globalVariables = globalVariables;
    }

    public ProcessOutput getOutputType() {
        return outputType;
    }

    public void setOutputType(ProcessOutput outputType) {
        this.outputType = outputType;
    }

    public ProcessCollection getProcessCollection() {
        return processCollection;
    }

    public void setProcessCollection(ProcessCollection processCollection) {
        this.processCollection = processCollection;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Process)) {
            return false;
        }
        return id != null && id.equals(((Process) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Process{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", definition='" + definition + '\'' +
            ", isPublic=" + isPublic +
            ", isAttended=" + isAttended +
            ", isTriggerable=" + isTriggerable +
            ", created=" + created +
            ", updated=" + updated +
            ", lastRun=" + lastRun +
            ", executionInfo=" + executionInfo +
            ", createdBy=" + createdBy +
            ", system=" + system +
            ", botCollection=" + botCollection +
            ", editor=" + editor +
            ", tags=" + tags +
            ", outputType=" + outputType +
            ", collectionId=" + (processCollection != null ? processCollection.getId() : "") +
            ", tenantId=" + (tenant != null ? tenant.getId() : "") +
            '}';
    }
}
