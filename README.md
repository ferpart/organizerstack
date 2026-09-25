# OrganizerStack

A browser-based tool for stack-printing flat parts (MultiBoard tiles, bin bases, signs…). Upload an STL, choose how many high, download a BambuStudio `.3mf`. Nothing is uploaded, everything runs locally.

Open `index.html` in Chrome or Firefox (or serve it with GitHub Pages).

## Modes

**Air gap.** Copies are stacked with an empty gap of *layers × layer height* between them, so each part pulls apart by hand. BambuStudio shows "invalid config, load geometry data only" when opening these files; click OK.

**Interface layers.** No air gap. Between each pair of copies there's a thin slab (1–10 layers) shaped like the part's top face, holes included, and assigned to a second filament. Pick two materials that don't bond, like PLA parts with PETG interface layers, and the stack separates cleanly. Made for AMS setups.

- The whole stack is one object: parts and slabs are its parts, each with its own filament slot.
- `interface_shells` is turned on, so every part keeps a real top and bottom surface where it touches a slab.
- If the top isn't flat, the slab falls back to the part's bounding rectangle.

## Workflow

1. Upload the STL.
2. Pick a mode, the count, the layer height (match your slicer profile) and the separation layers.
3. Interface mode: set the part and interface filament slots.
4. Download the `.3mf`, open it in BambuStudio and make sure the project has filaments in those slots.
5. Slice, check the preview, print.

## Tips

- Use the same layer height here and in the slicer so the slabs land on whole layers.
- Check the total height against your printer's Z limit.

## Development

```sh
node test.mjs   # checks the interface slab is watertight with the right volume
```

## Credits

Based on [MultiStack](https://github.com/mrj0ne5CTHS/MultiStack) by mrj0ne5CTHS, released under the MIT license. The air-gap mode follows its approach; the interface-layer mode and UI are new here.

MultiBoard/MultiBuild is designed by [Jonathan Odom](https://www.multiboard.io/). This is an unofficial community tool, not affiliated with or endorsed by MultiBuild.

## License

MIT, see [LICENSE](LICENSE).
