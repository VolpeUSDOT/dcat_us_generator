(function () {
  const SPATIAL_INPUT_ID = "spatial";
  const STATUS_ELEMENT_ID = "spatialStatus";
  const GEOJSON_OUTPUT_ID = "spatialGeojson";
  const HEADER = "DCAT Bounding Box";
  let mapWindow = null;

  function formatGeoJsonPolygon({ west, south, east, north }) {
    const polygon = {
      type: "Polygon",
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    };

    return JSON.stringify(polygon);
  }

  function formatSummary({ west, south, east, north }) {
    return `${HEADER}: west=${west.toFixed(6)}, south=${south.toFixed(6)}, east=${east.toFixed(6)}, north=${north.toFixed(6)}`;
  }

  function writeSpatialValue(payload) {
    const spatialInput = document.getElementById(SPATIAL_INPUT_ID);
    const statusElement = document.getElementById(STATUS_ELEMENT_ID);
    const geoJsonOutput = document.getElementById(GEOJSON_OUTPUT_ID);

    if (!spatialInput) {
      return;
    }

    const geoJsonText = formatGeoJsonPolygon(payload);

    spatialInput.value = geoJsonText;

    if (statusElement) {
      statusElement.textContent = formatSummary(payload);
    }

    if (geoJsonOutput) {
      geoJsonOutput.value = JSON.stringify(JSON.parse(geoJsonText), null, 2);
    }
  }

  function openMapWindow() {
    const width = 960;
    const height = 720;
    const left = window.screenX + 60;
    const top = window.screenY + 40;
    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    if (!mapWindow || mapWindow.closed) {
      mapWindow = window.open("map.html", "dcatBboxSelector", features);
    } else {
      mapWindow.focus();
    }
  }

  function bindLaunchControl() {
    const launchButton = document.getElementById("openSpatialTool");
    if (!launchButton) {
      return;
    }

    launchButton.addEventListener("click", openMapWindow);
  }

  function handleMessage(event) {
    const data = event.data;
    if (!data || data.source !== "dcat-bbox-selector") {
      return;
    }

    const payload = data.payload || {};

    if (payload.type === "bbox") {
      writeSpatialValue(payload);
    }

    if (payload.type === "closed") {
      mapWindow = null;
    }
  }

  document.addEventListener("DOMContentLoaded", bindLaunchControl);
  window.addEventListener("message", handleMessage);
})();
