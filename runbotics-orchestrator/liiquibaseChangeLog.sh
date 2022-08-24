#jhipster import-jdl ./jdl/jhipster-jdl.jdl
# and skip files which should not be updated
./gradlew classes #compile classes first
./gradlew liquibaseDiffChangelog -PrunList=diffLog #create changelog
# go to runbotics/src/main/resources/config/liquibase/changelog and add new changelog to master.xml
# remove entry from changelog: it's broken and always added
#    <changeSet author="gontareka (generated)" id="1613594125985-1">
#        <alterSequence sequenceName="sequence_generator"/>
#    </changeSet>
# revert changes in ProcessResource
