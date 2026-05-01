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

function normalizeString(value) {
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
}

function normalizeEmail(value) {
    const normalized = normalizeString(value);
    return normalized ? normalized.toLowerCase() : null;
}

function normalizeAccessLevel(value) {
    const normalized = normalizeString(value);
    return normalized ? normalized.toLowerCase() : null;
}

function normalizeFormat(value) {
    const normalized = normalizeString(value);
    return normalized ? normalized.toUpperCase() : null;
}

function normalizeMetadataVersion(value) {
    return normalizeString(value) || "3.0";
}

function normalizeDate(value) {
    const normalized = normalizeString(value);
    if (!normalized) {
        return null;
    }
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
        return normalized;
    }
    return parsed.toISOString().split("T")[0];
}

function normalizeThemeList(themeInput) {
    if (themeInput === undefined || themeInput === null) {
        return [];
    }
    const values = Array.isArray(themeInput) ? themeInput : [themeInput];
    const seen = new Set();
    const result = [];
    values.forEach(value => {
        if (typeof value !== "string") {
            return;
        }
        value.split(/[,\n\r]+/)
            .map(segment => normalizeString(segment))
            .filter(Boolean)
            .forEach(normalized => {
                const key = normalized.toLowerCase();
                if (seen.has(key)) {
                    return;
                }
                seen.add(key);
                result.push(normalized);
            });
    });
    return result;
}

function normalizeKeywords(keywords = []) {
    const seen = new Set();
    const result = [];
    keywords.forEach(keyword => {
        const normalized = normalizeString(keyword);
        if (!normalized) {
            return;
        }
        const key = normalized.toLowerCase();
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        result.push(normalized);
    });
    return result;
}

function normalizeCodeList(codeInput) {
    const values = Array.isArray(codeInput) ? codeInput : [codeInput];
    const seen = new Set();
    const result = [];
    values.forEach(value => {
        if (typeof value !== "string") {
            return;
        }
        value.split(/[,;\n\r]+/)
            .map(segment => normalizeString(segment))
            .filter(Boolean)
            .forEach(normalized => {
                const key = normalized.toUpperCase();
                if (seen.has(key)) {
                    return;
                }
                seen.add(key);
                result.push(normalized);
            });
    });
    return result;
}

function normalizeLanguageList(languageInput) {
    const values = Array.isArray(languageInput) ? languageInput : [languageInput];
    const seen = new Set();
    const result = [];
    values.forEach(value => {
        if (typeof value !== "string") {
            return;
        }
        value.split(/[,;\n\r]+/)
            .map(segment => normalizeString(segment))
            .filter(Boolean)
            .forEach(normalized => {
                const key = normalized.toLowerCase();
                if (seen.has(key)) {
                    return;
                }
                seen.add(key);
                result.push(normalized.toLowerCase());
            });
    });
    return result;
}

function normalizeReferenceList(referenceInput) {
    const values = Array.isArray(referenceInput) ? referenceInput : [referenceInput];
    const seen = new Set();
    const result = [];
    values.forEach(value => {
        if (typeof value !== "string") {
            return;
        }
        value.split(/[\n\r]+/)
            .map(segment => normalizeString(segment))
            .filter(Boolean)
            .forEach(normalized => {
                const key = normalized.toLowerCase();
                if (seen.has(key)) {
                    return;
                }
                seen.add(key);
                result.push(normalized);
            });
    });
    return result;
}

function normalizeSubOrganizations(subOrganizations = []) {
    const seen = new Set();
    const result = [];
    subOrganizations.forEach(name => {
        const normalized = normalizeString(name);
        if (!normalized) {
            return;
        }
        const key = normalized.toLowerCase();
        if (seen.has(key)) {
            return;
        }
        seen.add(key);
        result.push(normalized);
    });
    return result;
}

function normalizeContactPoint(fnValue, emailValue) {
    const fn = normalizeString(fnValue);
    const email = normalizeEmail(emailValue);
    if (!fn && !email) {
        return null;
    }
    return {
        fn,
        email
    };
}

function normalizePublisher(name, hierarchy) {
    const normalizedName = normalizeString(name);
    const normalizedHierarchy = hierarchy || null;
    if (!normalizedName && !normalizedHierarchy) {
        return null;
    }
    return {
        name: normalizedName,
        hierarchy: normalizedHierarchy
    };
}

function normalizeFiles(files = [], fileDefinitions = {}, extensionMetadata = {}) {
    const seen = new Set();
    return files.map(file => {
        const filename = normalizeString(file.filename);
        if (!filename) {
            return null;
        }
        const key = filename.toLowerCase();
        if (seen.has(key)) {
            return null;
        }
        seen.add(key);
        const extension = filename.includes(".") ? filename.split(".").pop().toLowerCase() : "";
        const descriptionInput = normalizeString(file.filedescription);
        const mediaTypeCandidate = normalizeString(file.ianamediatype);
        const description = descriptionInput || fileDefinitions[extension] || null;
        const mediaType = mediaTypeCandidate || extensionMetadata[extension] || null;
        const format = extension ? extension.toUpperCase() : null;
        return {
            title: filename,
            description,
            mediaType,
            format
        };
    }).filter(Boolean);
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

function buildCanonicalModel({ formValues, keywords, files, subOrganizations, fileDefinitions, extensionMetadata }) {
    const metadataVersion = normalizeMetadataVersion(formValues.metadataversion);
    const title = normalizeString(formValues.title) || "";
    const description = normalizeString(formValues.description) || "";
    const accessLevel = normalizeAccessLevel(formValues.publicaccesslevel);
    const bureauCodes = normalizeCodeList(formValues.bureaucode);
    const programCodes = normalizeCodeList(formValues.programcode);
    const languages = normalizeLanguageList(formValues.language);
    const identifier = normalizeString(formValues.doi);
    const landingPage = identifier || normalizeString(formValues.landingpage);
    const issued = normalizeDate(formValues.issued);
    const modified = normalizeDate(formValues.modified);
    const references = normalizeReferenceList(formValues.references);
    const themes = metadataVersion === "3.0" ? normalizeThemeList(formValues.theme) : [];
    const policyStatement = normalizeString(formValues.policystatement);
    const policyURL = normalizeString(formValues.policyurl);
    const normalizedSubOrgList = normalizeSubOrganizations(subOrganizations);
    const subOrgHierarchy = normalizedSubOrgList.length ? createSubOrgHierarchy(normalizedSubOrgList, 0) : null;
    const publisher = normalizePublisher(formValues.publisher, subOrgHierarchy);
    const contact = normalizeContactPoint(formValues.contactpointfn, formValues.contactpointemail);
    const normalizedKeywords = normalizeKeywords(keywords);
    const normalizedFiles = normalizeFiles(files, fileDefinitions, extensionMetadata);
    const license = normalizeString(formValues.license);
    const rights = normalizeString(formValues.rightsstatement) || normalizeString(formValues.rights);
    const spatial = normalizeString(formValues.spatial);
    const format = normalizeFormat(formValues.format);
    const isPartOf = normalizeString(formValues.collection) || normalizeString(formValues.rosapcollection);
    const webService = normalizeString(formValues.fedorapid);

    return {
        metadataVersion,
        dataset: {
            title,
            description,
            accessLevel,
            bureauCodes,
            contact,
            dataQuality: true,
            distributions: normalizedFiles,
            format,
            identifier,
            isPartOf,
            issued,
            keywords: normalizedKeywords,
            landingPage,
            languages,
            license,
            modified,
            policy: (policyStatement || policyURL) ? { statement: policyStatement, url: policyURL } : null,
            programCodes,
            publisher,
            references,
            themes,
            rights,
            spatial,
            webService
        }
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

function mapContactPoint(contact) {
    if (!contact) {
        return null;
    }
    return stripNulls({
        "@type": "vcard:Contact",
        "fn": contact.fn,
        "hasEmail": contact.email ? `mailto:${contact.email}` : null
    });
}

function mapPublisher(publisher) {
    if (!publisher) {
        return null;
    }
    return stripNulls({
        "@type": "org:Organization",
        "name": publisher.name,
        ...(publisher.hierarchy && { "subOrganizationOf": publisher.hierarchy })
    });
}

function mapDistributions(distributions, dataset) {
    const accessURL = dataset.landingPage || dataset.webService || dataset.identifier || null;
    return distributions.map(distribution => stripNulls({
        "@type": "dcat:Distribution",
        "accessURL": accessURL,
        "title": distribution.title,
        "format": distribution.format,
        "mediaType": distribution.mediaType,
        "description": distribution.description
    }));
}

function serializeDcatUs11(model) {
    const dataset = model.dataset;
    const output = {
        "$schema": "https://resources.data.gov/schemas/dcat-us/v1.1/schema/catalog.json",
        "conformsTo": "https://project-open-data.cio.gov/v1.1/schema",
        "@type": "dcat:Catalog",
        "@context": "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",
        "dataset": [
            stripNulls({
                "@type": "dcat:Dataset",
                "accessLevel": dataset.accessLevel,
                "bureauCode": dataset.bureauCodes && dataset.bureauCodes.length ? dataset.bureauCodes : null,
                "contactPoint": mapContactPoint(dataset.contact),
                "dataQuality": dataset.dataQuality,
                "description": dataset.description,
                "distribution": mapDistributions(dataset.distributions, dataset),
                "format": dataset.format,
                "identifier": dataset.identifier,
                "isPartOf": dataset.isPartOf,
                "issued": dataset.issued,
                "keyword": dataset.keywords,
                "theme": dataset.themes && dataset.themes.length ? dataset.themes : null,
                "landingPage": dataset.landingPage,
                "language": dataset.languages && dataset.languages.length ? dataset.languages : null,
                "license": dataset.license,
                "modified": dataset.modified,
                "policyStatement": dataset.policy?.statement || null,
                "policyURL": dataset.policy?.url || null,
                "programCode": dataset.programCodes && dataset.programCodes.length ? dataset.programCodes : null,
                "publisher": mapPublisher(dataset.publisher),
                "references": dataset.references && dataset.references.length ? dataset.references : null,
                "rights": dataset.rights,
                "spatial": dataset.spatial,
                "title": dataset.title,
                "webService": dataset.webService
            })
        ]
    };

    return stripNulls(output);
}

function serializeDcatUs3(model) {
    const dataset = model.dataset;
    const output = {
        "$schema": "https://resources.data.gov/schemas/dcat-us/v3.0/schema/catalog.json",
        "conformsTo": "https://resources.data.gov/resources/dcat-us3/",
        "@type": "dcat:Catalog",
        "@context": "https://resources.data.gov/schemas/dcat-us/v3.0/schema/catalog.jsonld",
        "dataset": [
            stripNulls({
                "@type": "dcat:Dataset",
                "accessLevel": dataset.accessLevel,
                "bureauCode": dataset.bureauCodes && dataset.bureauCodes.length ? dataset.bureauCodes : null,
                "contactPoint": mapContactPoint(dataset.contact),
                "description": dataset.description,
                "distribution": mapDistributions(dataset.distributions, dataset),
                "identifier": dataset.identifier,
                "isPartOf": dataset.isPartOf,
                "issued": dataset.issued,
                "keyword": dataset.keywords,
                "theme": dataset.themes && dataset.themes.length ? dataset.themes : null,
                "landingPage": dataset.landingPage,
                "language": dataset.languages && dataset.languages.length ? dataset.languages : null,
                "license": dataset.license,
                "modified": dataset.modified,
                "programCode": dataset.programCodes && dataset.programCodes.length ? dataset.programCodes : null,
                "publisher": mapPublisher(dataset.publisher),
                "references": dataset.references && dataset.references.length ? dataset.references : null,
                "rights": dataset.rights,
                "spatial": dataset.spatial,
                "title": dataset.title,
                "webService": dataset.webService
            })
        ]
    };

    return stripNulls(output);
}

function validateByProfile(model) {
    const errors = [];
    const dataset = model.dataset;

    if (!dataset.title) errors.push("Title is required.");
    if (!dataset.description) errors.push("Description is required.");

    if (model.metadataVersion === "3.0") {
        if (!dataset.identifier) errors.push("Identifier is required for DCAT-US 3.");
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

function toggleProfileUI(metadataVersion) {
    const profileSections = document.querySelectorAll('.profile-section');
    profileSections.forEach(section => {
        const appliesTo = section.getAttribute('data-profile');
        const shouldShow = appliesTo === metadataVersion;
        section.hidden = !shouldShow;
    });

    const hints = document.querySelectorAll('.field-hint');
    hints.forEach(hint => {
        const appliesTo = hint.getAttribute('data-profile');
        if (appliesTo === 'all') {
            hint.hidden = false;
            return;
        }
        hint.hidden = appliesTo !== metadataVersion;
    });

    const profileRequiredInputs = document.querySelectorAll('[data-required-profile]');
    profileRequiredInputs.forEach(input => {
        const appliesTo = input.getAttribute('data-required-profile');
        input.required = appliesTo === metadataVersion;
    });
}

function validateForm() {
    const form = document.forms["libraryItemForm"];
    const fedoraInput = form["fedorapid"];
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
    const subOrganizations = collectSubOrganizations();

    return {
        formValues: jsonObject,
        keywords,
        files,
        subOrganizations,
        fileDefinitions,
        extensionMetadata
    };
}

// Generate JSON
async function generateJSON() {
    const canonicalInputs = await collectFormData();
    toggleProfileUI(canonicalInputs.formValues.metadataversion || '1.1');
    const canonicalModel = buildCanonicalModel(canonicalInputs);

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
    link.download = `${canonicalModel.dataset.title || "dcat-us-metadata"}.json`;
    link.style.display = 'block';
    link.textContent = "Download your JSON file";
}

document.addEventListener('DOMContentLoaded', () => {
    const metadataVersionField = document.getElementById('metadataVersion');
    if (metadataVersionField) {
        toggleProfileUI(metadataVersionField.value || '1.1');
        metadataVersionField.addEventListener('change', event => {
            toggleProfileUI(event.target.value || '1.1');
        });
    }
});
