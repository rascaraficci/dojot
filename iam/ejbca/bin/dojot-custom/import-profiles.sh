#!/bin/bash

function importProfiles() {
    # import into EJBCA the certificate profiles, as long as
    # the profile directory exists and has files there!
    if [ -d "${PROFILES_DIR}" ] && [ "$(ls -A "${PROFILES_DIR}")" ]; then
        echo
        log "INFO" "Importing Certificate and End Entity Profiles"
        ejbca_cmd ca importprofiles -d "${PROFILES_DIR}"

        ejbca_cmd ca editcertificateprofile \
            --cpname "${DEVICES_CA_CERT_PROFILE}" \
            --field 'encodedValidity' \
            --value "${PKI_VALIDITY}"

        ejbca_cmd ca editcertificateprofile \
            --cpname "${INTERNAL_CA_CERT_PROFILE}" \
            --field 'encodedValidity' \
            --value "${PKI_VALIDITY}"

        ejbca_cmd ca editcertificateprofile \
            --cpname "${APP_SERVER_CERT_PROFILE}" \
            --field 'encodedValidity' \
            --value "${PKI_VALIDITY}"

        ejbca_cmd ca editcertificateprofile \
            --cpname "${DEVICES_CERT_PROFILE}" \
            --field 'encodedValidity' \
            --value "${PKI_VALIDITY}"

        ejbca_cmd ca editcertificateprofile \
            --cpname "${INTERNAL_CERT_PROFILE}" \
            --field 'encodedValidity' \
            --value "${PKI_VALIDITY}"
    else
        echo
        log "ERROR" "The configuration Profiles could not be imported because the '${PROFILES_DIR}' directory does not exist or is empty!"
        exit 1;
    fi
}
