// Add Keyword Field
function addKeyword() {
    const keywordContainer = document.getElementById('keywordContainer');
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="text" name="keyword[]" placeholder="Enter keyword">
        <button type="button" onclick="removeField(this)" class="button3">Remove Field</button><br><br>
    `;
    keywordContainer.appendChild(div);
}

// Add File Group
function addFileGroup() {
    const fileContainer = document.getElementById('fileContainer');
    const div = document.createElement('div');
    div.classList.add('file-group');
    div.innerHTML = `
        <label for="filename">Name of file:</label><br>
            <input type="text" id="filename" name="filename"><br><br>
            
            <label for="filedescription">Description of file:</label><br>
            <input type="text" id="filedescription" name="filedescription"><br><br>

            <label for="ianamediatype">Add Distribution Files:</label><br>
            <input type="text" list="ianamediatype">
            <datalist name="ianamediatype" id="ianamediatype">
                <option value="application/geo+json">application/geo+json</option>
                <option value="application/javascript">application/javascript</option>
                <option value="application/json">application/json</option>
                <option value="application/pdf">application/pdf</option>
                <option value="application/vnd.ms-excel">application/vnd.ms-excel</option>
                <option value="application/vnd.ms-powerpoint">application/vnd.ms-powerpoint</option>
                <option value="application/vnd.ms-word.document.macroEnabled.12">application/vnd.ms-word.document.macroEnabled.12</option>
                <option value="application/zip">application/zip</option>
                <option value="audio/mpeg">audio/mpeg</option>
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/png">image/png</option>
                <option value="text/csv">text/csv</option>
                <option value="text/markdown">text/markdown</option>
                <option value="text/plain">text/plain</option>
                <option value="text/xml">text/xml</option>
                <option value="text/x-python">text/x-python</option>
                <option value="video/mp4">video/mp4</option>
            </datalist><br>

        <button type="button" onclick="removeField(this)" class="button3">Remove Field</button><br><br>
    `;
    fileContainer.appendChild(div);
}

// Add Sub-Organization
function addSubOrganization() {
    const subOrgContainer = document.getElementById('subOrganizationContainer');
    const div = document.createElement('div');
    div.innerHTML = `
        <label for="suborg">Sub-Organization: </label>
        <input type="text" name="suborg[]">
        <button type="button" onclick="removeField(this)" class="button3">Remove Field</button><br><br>
    `;
    subOrgContainer.appendChild(div);
}

// Sub-Organizations Hierarchy
function createSubOrgHierarchy(subOrgs, start) {
    if (start >= subOrgs.length - 1) {
        return {
            "@type": "org:Organization",
            "name": subOrgs[start],
        }
    } else {
        return {
            "@type": "org:Organization",
            "name": subOrgs[start],
            "subOrganizationOf": createSubOrgHierarchy(subOrgs, start + 1)
        };
    }
}

// Remove Field
function removeField(element) {
    element.parentElement.remove();
}

function sanitizeFormData(formData) {
    const jsonObject = {};
    formData.forEach((value, key) => {
        if (typeof value === "string" && value.trim() !== "") {
            jsonObject[key] = value.trim();
        }
    });
    return jsonObject;
}

function collectKeywords() {
    return Array.from(document.querySelectorAll('input[name="keyword[]"], input[name="keyword"]'))
        .map(input => input.value.trim())
        .filter(value => value !== "");
}

function collectFileGroups() {
    return Array.from(document.querySelectorAll('.file-group')).map(group => ({
        filename: group.querySelector('input[name="filename"]')?.value.trim() || "",
        filedescription: group.querySelector('input[name="filedescription"]')?.value.trim() || "",
        ianamediatype: group.querySelector('input[list="ianamediatype"]')?.value.trim() || ""
    })).filter(file => file.filename || file.filedescription || file.ianamediatype);
}

function collectFilesFromTextarea() {
    return (document.getElementById("filelist")?.value || "")
        .split("\n")
        .map(f => f.trim())
        .filter(f => f.length > 0);
}

function collectSubOrganizations() {
    return Array.from(document.querySelectorAll('input[name="suborg[]"]'))
        .map(input => input.value.trim())
        .filter(value => value !== "");
}

function buildDistributions(files, doi, fileDefinitions) {
    return files.map(file => {
        const extension = file.filename.includes(".") ? file.filename.split(".").pop().toLowerCase() : "";
        const formatType = extension.toUpperCase();

        return {
            "@type": "dcat:Distribution",
            "accessURL": doi,
            "title": file.filename,
            "format": formatType,
            "mediaType": file.ianamediatype,
            "description": file.filedescription || fileDefinitions[extension] || ""
        };
    });
}

function buildCanonicalModel(jsonObject, keywords, distributions, subOrgHierarchy) {
    const bureauCode = document.querySelector('#bureaucode')?.value || null;
    const programCode = document.querySelector('#programcode')?.value || null;
    const language = document.querySelector('#language')?.value || null;
    const references = document.querySelector('#references')?.value || null;

    return {
        metadataVersion: jsonObject.metadataversion || "1.1",
        title: jsonObject.title || "",
        description: jsonObject.description || "",
        accessLevel: jsonObject.publicaccesslevel || null,
        bureauCode: bureauCode ? [bureauCode] : null,
        contactPointFn: jsonObject.contactpointfn || null,
        contactPointEmail: jsonObject.contactpointemail || null,
        distributions,
        format: jsonObject.format || null,
        identifier: jsonObject.doi || null,
        isPartOf: jsonObject.collection || jsonObject.rosapcollection || null,
        issued: jsonObject.issued || null,
        keyword: keywords,
        landingPage: jsonObject.doi || null,
        language: language ? [language] : null,
        license: jsonObject.license || null,
        modified: jsonObject.modified || null,
        policyStatement: jsonObject.policystatement || null,
        policyURL: jsonObject.policyurl || null,
        programCode: programCode ? [programCode] : null,
        publisherName: jsonObject.publisher || null,
        subOrgHierarchy,
        references: references ? [references] : null,
        rights: jsonObject.rights || jsonObject.rightsstatement || null,
        spatial: jsonObject.spatial || null,
        webService: jsonObject.fedorapid || null,
        dataQuality: true
    };
}

function stripNulls(value) {
    if (Array.isArray(value)) {
        const cleaned = value
            .map(stripNulls)
            .filter(v => v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0));
        return cleaned;
    }

    if (value && typeof value === "object") {
        const cleanedObject = {};
        Object.entries(value).forEach(([key, val]) => {
            const cleanedValue = stripNulls(val);
            if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== "") {
                if (!(Array.isArray(cleanedValue) && cleanedValue.length === 0)) {
                    cleanedObject[key] = cleanedValue;
                }
            }
        });
        return cleanedObject;
    }

    return value;
}

function serializeDcatUs11(model) {
    const output = {
        "$schema": "https://resources.data.gov/schemas/dcat-us/v1.1/schema/catalog.json",
        "conformsTo": "https://project-open-data.cio.gov/v1.1/schema",
        "@type": "dcat:Catalog",
        "@context": "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",
        "dataset": [
            {
                "@type": "dcat:Dataset",
                "accessLevel": model.accessLevel,
                "bureauCode": model.bureauCode,
                "contactPoint": {
                    "fn": model.contactPointFn,
                    "hasEmail": model.contactPointEmail ? "mailto:" + model.contactPointEmail : null,
                    "@type": "vcard:Contact"
                },
                "dataQuality": model.dataQuality,
                "description": model.description,
                "distribution": model.distributions,
                "format": model.format,
                "identifier": model.identifier,
                "isPartOf": model.isPartOf,
                "issued": model.issued,
                "keyword": model.keyword,
                "landingPage": model.landingPage,
                "language": model.language,
                "license": model.license,
                "modified": model.modified,
                "policyStatement": model.policyStatement,
                "policyURL": model.policyURL,
                "programCode": model.programCode,
                "publisher": {
                    "@type": "org:Organization",
                    "name": model.publisherName,
                    ...(model.subOrgHierarchy && { "subOrganizationOf": model.subOrgHierarchy })
                },
                "references": model.references,
                "rights": model.rights,
                "spatial": model.spatial,
                "title": model.title,
                "webService": model.webService
            }
        ]
    };

    return stripNulls(output);
}

function serializeDcatUs3(model) {
    // Provisional serializer profile for transition period.
    // Uses DCAT-US 3 schema/context references with current field mappings.
    const output = {
        "$schema": "https://resources.data.gov/schemas/dcat-us/v3.0/schema/catalog.json",
        "conformsTo": "https://resources.data.gov/resources/dcat-us3/",
        "@type": "dcat:Catalog",
        "@context": "https://resources.data.gov/schemas/dcat-us/v3.0/schema/catalog.jsonld",
        "dataset": [
            {
                "@type": "dcat:Dataset",
                "accessLevel": model.accessLevel,
                "bureauCode": model.bureauCode,
                "contactPoint": {
                    "fn": model.contactPointFn,
                    "hasEmail": model.contactPointEmail ? "mailto:" + model.contactPointEmail : null,
                    "@type": "vcard:Contact"
                },
                "description": model.description,
                "distribution": model.distributions,
                "identifier": model.identifier,
                "isPartOf": model.isPartOf,
                "issued": model.issued,
                "keyword": model.keyword,
                "landingPage": model.landingPage,
                "language": model.language,
                "license": model.license,
                "modified": model.modified,
                "programCode": model.programCode,
                "publisher": {
                    "@type": "org:Organization",
                    "name": model.publisherName,
                    ...(model.subOrgHierarchy && { "subOrganizationOf": model.subOrgHierarchy })
                },
                "references": model.references,
                "rights": model.rights,
                "spatial": model.spatial,
                "title": model.title,
                "webService": model.webService
            }
        ]
    };

    return stripNulls(output);
}

function validateByProfile(model) {
    const errors = [];

    if (!model.title) errors.push("Title is required.");
    if (!model.description) errors.push("Description is required.");

    if (model.metadataVersion === "3.0") {
        if (!model.identifier) errors.push("Identifier is required for DCAT-US 3.");
    }

    if (!model.metadataVersion || (model.metadataVersion !== "1.1" && model.metadataVersion !== "3.0")) {
        errors.push("Metadata version must be 1.1 or 3.0.");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

function serializeByProfile(model) {
    const version = model.metadataVersion;
    if (version === "3.0") {
        return serializeDcatUs3(model);
    }
    return serializeDcatUs11(model);
}

function validateForm() {
    const fedoraInput = document.forms["libraryItemForm"]["fedorapid"];
    const x = fedoraInput.value.trim();

    if (x) {
        fedoraInput.value = "https://rosap.ntl.bts.gov/fedora/oai?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:dot.stacks:" + x;
    } else {
        fedoraInput.value = "";
    }

    generateJSON();

    // Scroll to the download link after generating JSON
    const link = document.getElementById("downloadLink");
    link.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Generate JSON
async function collectFormData() {
    const form = document.getElementById("libraryItemForm");
    const formData = new FormData(form);
    const jsonObject = sanitizeFormData(formData);

    const keywords = collectKeywords();
    const filesFromGroups = collectFileGroups();
    const rawFileList = collectFilesFromTextarea();

    const [extensionMetadata, fileDefinitions] = await Promise.all([
        fetch("collections_and_file_types.json").then(r => r.json()),
        fetch("file_definitions.json").then(r => r.json())
    ]);

    const filesFromText = rawFileList.map(title => {
        const extension = title.includes(".") ? title.split(".").pop().toLowerCase() : "";
        return {
            filename: title,
            filedescription: fileDefinitions[extension] || "",
            ianamediatype: extensionMetadata[extension] || "application/octet-stream"
        };
    });

    const files = [...filesFromGroups, ...filesFromText];
    const distributions = buildDistributions(files, jsonObject.doi, fileDefinitions);

    const subOrgs = collectSubOrganizations();
    let subOrgHierarchy = null;
    if (subOrgs.length !== 0) {
        subOrgHierarchy = createSubOrgHierarchy(subOrgs, 0);
    }

    return {
        jsonObject,
        keywords,
        distributions,
        subOrgHierarchy
    };
}

// Generate JSON
async function generateJSON() {
    const { jsonObject, keywords, distributions, subOrgHierarchy } = await collectFormData();
    const canonicalModel = buildCanonicalModel(jsonObject, keywords, distributions, subOrgHierarchy);

    const validation = validateByProfile(canonicalModel);
    if (!validation.isValid) {
        alert(validation.errors.join("\n"));
        return;
    }

    const jsonData = serializeByProfile(canonicalModel);

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.getElementById("downloadLink");
    link.href = URL.createObjectURL(blob);
    link.download = `${canonicalModel.title || "dcat-us-metadata"}.json`;
    link.style.display = 'block';
    link.textContent = "Download your JSON file";
}
