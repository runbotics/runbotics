#curl -X GET \
#          -H "Authorization: token $GIT_TOKEN" \
#          -H "Content-Type: application/json" \
#          -H "Accept: application/json" \
#          "https://git.clouddc.eu/api/v1/repos/RPA/runbotics/actions/runs/321"

curl -X GET \
          -H "Authorization: token $GIT_TOKEN" \
          -H "Content-Type: application/json" \
          "https://git.clouddc.eu/api/v1/repos/RPA/runbotics/actions/runs/321/artifacts"
