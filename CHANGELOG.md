## v1.0.0-beta.16
#### 24 May 2021
- fixed `simplifyDataType` implementation (handling undefined datatype)
- logging validations errors in dev mode
## v1.0.0-beta.15
#### 20 May 2021
- removed wrong import from importExport
- added new `overrideBaseOptions` function
## v1.0.0-beta.14
#### 03 Mar 2021
- numberparser: fixed regexp for group separator
- Add import and export (multiversion)
- working on docs
## v1.0.0-beta.13
#### 28 Feb 2021
- fixed number parsing
## v1.0.0-beta.12
#### 25 Feb 2021
- removed `iso` date format specialization, added `YYYY-MM-DDTHH:mm:ss` format
## v1.0.0-beta.11
#### 25 Feb 2021
- fixed data parsing (everything was parsed as iso date)
## v1.0.0-beta.10
#### 25 Feb 2021
- added explicit iso (with undefined formatter) to exported date formats
- updated publishing action
## v1.0.0-beta.9
#### 24 Feb 2021
- color scale generation: if no scaletype or interpolator, default color scale is generated
- color scales: allow automatic scale values; explicit scaletype/interpolator check.
- multiple web sandbox. 
- better date parsing (parsing iso dates by default)

## v1.0.0-beta.8
#### 23 Feb 2021
- switched publishing to npm
## v1.0.0-beta.7
#### 19 Feb 2021
- fixed condition for getting default color scale
- dataset/inferTypes: default value for parsingOptions
- added median aggregation function from d3 array
- working on docs

## v1.0.0-beta.6
#### 16 Feb 2021
- feature: support for custom domain in color scale via "domain" property in visual options
- fix: support for using "dimension" property in color scale with non-mapped dimensions

## v1.0.0-beta.5
#### 09 Feb 2021

- Support for default color scale
- Support for new color scale property: locked
- Support for disabing visual options with "requiredDimensions" property
- Added new date format to defaults (date with time)
- Skip parsing empty rows

## v1.0.0-beta.4
#### 01 Feb 2021

Features:
- Support for styles override in charts

## v1.0.0-beta.3
#### 01 Dec 2020

Features:
- Support for repeated options
- Added labels occlusion utility

## v1.0.0beta2
#### 26 Nov 2020

Fixes:
- Testing github action


## v1.0.0beta1
#### 26 Nov 2020

Features:
- Better support for color scales based on dates
- Integration for github actions (still publishing on inmagik registry)
