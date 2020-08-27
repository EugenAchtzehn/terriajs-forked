import React from "react";

import createReactClass from "create-react-class";

import PropTypes from "prop-types";

import naturalSort from "javascript-natural-sort";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import { observer } from "mobx-react";

import Styles from "./data-preview.scss";

naturalSort.insensitive = true;
import { withTranslation } from "react-i18next";

/**
 * CatalogItem-defined sections that sit within the preview description. These are ordered according to the catalog item's
 * order if available.
 */
const DataPreviewSections = observer(
  createReactClass({
    displayName: "DataPreviewSections",

    propTypes: {
      metadataItem: PropTypes.object.isRequired,
      t: PropTypes.func.isRequired
    },

    sortInfoSections(items) {
      const infoSectionOrder = this.props.metadataItem.infoSectionOrder;

      items.sort(function(a, b) {
        const aIndex = infoSectionOrder.indexOf(a.name);
        const bIndex = infoSectionOrder.indexOf(b.name);
        if (aIndex >= 0 && bIndex < 0) {
          return -1;
        } else if (aIndex < 0 && bIndex >= 0) {
          return 1;
        } else if (aIndex < 0 && bIndex < 0) {
          return naturalSort(a.name, b.name);
        }
        return aIndex - bIndex;
      });

      return items;
    },

    render() {
      const metadataItem = this.props.metadataItem;
      const items = metadataItem.hideSource
        ? metadataItem.infoWithoutSources
        : metadataItem.info.slice();

      return (
        <div>
          <For each="item" index="i" of={this.sortInfoSections(items)}>
            <If condition={item.content && item.content.length > 0}>
              <div key={i}>
                <h2 className={Styles.subHeading}>{item.name}</h2>
                {parseCustomMarkdownToReact(item.content, {
                  catalogItem: metadataItem
                })}
              </div>
            </If>
          </For>
        </div>
      );
    }
  })
);

export default withTranslation()(DataPreviewSections);
