# vt-perfomance-tests
Benchmark tests to compare indexed model vs non-indexed model of vector tiles

## To run test
* Run `npm install` to get dependencies
* Run `node js/bench-clip`

### Test Description

The test consists of two steps:
* Process the leaf tile for one LOD higher than its native LOD. So if the tile is cooked down to level 10, the tile is rendered at level 11. It is processed four times, once for each tile coordinate that the leaf tile covers at level 11. Each time the tile is processed for a tile coordinate the geometries needed by the tile are run through the clipping process.
* Process the 4 child tiles that were cooked specifically for the zoom level that was tested in step 1.

The tile data used in the test is in the fixtures directory. The tile coordinates run through the tests were:

*Tile coordinate 1:*
  * Leaf tile: 10, 177,399
  * Full tiles:
    * 11, 354, 798
    * 11, 354, 799
    * 11, 355, 798
    * 11, 355, 799
    
*Tile coordinate 2:*
  * Leaf tile: 10, 177, 401:
  * Full tiles:
    * 11, 354, 802
    * 11, 354, 803
    * 11, 355, 802
    * 11, 355, 803
